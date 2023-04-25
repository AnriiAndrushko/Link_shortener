//import Head from 'next/head'
//import Image from 'next/image'
//import { Inter } from 'next/font/google'
import styles from '@/styles/inputForm.module.css'
import React, {useEffect, useRef, useState} from "react";
//const inter = Inter({ subsets: ['latin'] })
//import InputForm from '../../modules/inputForm'

async function getIP() {
    let data;
    try {
        const response = await fetch('https://geolocation-db.com/json/');
        data = await response.json();
    }catch (err){
        console.log(err);
    }
    return data.IPv4?data.IPv4:"All";
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
            return fetch("/api/url?userIP="+userIP.current,{
            method:"GET",
            headers:{
                "content-type":"application/json",
            },
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
                    <div className={styles.group}>
                        <input type="text" required value={newUrl} onChange={(e)=>setNewUrl(e.target.value)}/>
                        <span className="highlight"></span>
                        <span className="bar"></span>
                        <label>Enter your url</label>
                    </div>
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
                                    <td>
                                        <button onClick={async ()=>{
                                            //e.preventDefault();

                                            const  response = await fetch(`/api/${urlObject.code}`,{
                                            method:"DELETE",
                                            headers:{
                                            "content-type":"application/json"
                                        },
                                        });
                                            if(response.status===200){
                                                setData([...data.filter(d=>d.code!==urlObject.code)]);
                                            }
                                        }
                                        }>Delete</button>
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



