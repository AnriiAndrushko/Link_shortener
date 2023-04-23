import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import React, {useEffect, useRef, useState} from "react";

const inter = Inter({ subsets: ['latin'] })


async function getIP() {
    const response = await fetch('https://geolocation-db.com/json/');
    const data = await response.json();
    return data.IPv4;
}

export default function Home({urlList}) {
    const [data,setData] = useState(urlList);
    const [newUrl, setNewUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    let userIP = useRef("All");

    useEffect(()=>{
        setIsLoading(true);
        const gettingIP = async ()=>{
            let ip = await getIP();
            userIP.current = ip;
            return ip;
        }
        gettingIP().then((ip)=>{
            return fetch("/api/url",{
            method:"GET",
            headers:{
                "content-type":"application/json",
                //,
                "X-Forwarded-For" : JSON.stringify(userIP.current),
            },
            //body:JSON.stringify({userIP:userIP,}),
        })
        }).then(res=> res.json()).then(res=>{

            setData(res);

        }).finally(()=>{
            setIsLoading(false);
        });
    },[])

    const handleOnSubmit = async (e)=> {
        e.preventDefault();
        const _newUrl = newUrl;
        setNewUrl("");

        const  response = await fetch("/api/url",{
            method:"POST",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify({url:_newUrl, userIP:await getIP(),}),
            });
        const content = await response.json()
        if(content){
            setData([...data, content]);
        }
    };

  return (
    <>
        <main>
            <div>
                <h2>Url Shortener</h2>
                <form onSubmit={handleOnSubmit}>
                    <input type="text"
                    placeholder="Enter your url..."
                    value={newUrl}
                    onChange={(e)=>setNewUrl(e.target.value)}
                    />
                    <button type="submit">
                        Create Short Url
                    </button>
                </form>
            </div>
            <div>
                <table>
                    <thead>
                    <tr>
                        <th scope="col">Original URL</th>
                        <th scope="col">Short URL</th>
                        <th scope="col">Owner</th>
                        <th scope="col">Clicked</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        data.map((urlObject)=>(
                            <React.Fragment key = {urlObject.code}>
                                <tr scope="row">
                                    <td>{
                                        <a href={urlObject.url}>
                                            {urlObject.url.slice(0,120)}
                                            {urlObject.url.length>120?"...":""}
                                        </a>
                                    }</td>
                                    <td>
                                        <a target="_blank" href={`/api/${urlObject.code}`} onClick={()=> {
                                            data[data.findIndex(el=>el.code===urlObject.code)].clicked++;
                                            setData([...data])}}>
                                            {urlObject.code}
                                        </a>
                                    </td>
                                    <td>
                                        {urlObject.owner}
                                    </td>
                                    <td>
                                        {urlObject.clicked}
                                    </td>

                                </tr>
                            </React.Fragment>
                        ))
                    }
                    </tbody>
                </table>
            </div>
        </main>
    </>
  );
}//TODO:different path


//To prerender page on server, actually useless in my case. It's just for search engines.
export async function  getServerSideProps(context){
    const res = await fetch("http://localhost:3000/api/url",{
        method:"GET",
        headers:{
            "content-type":"application/json"
        },
        query:JSON.stringify({userIP:await getIP(),}),
    });
    const urlList = await res.json();
    return{
        props:{
            urlList,
        },
    };
}



