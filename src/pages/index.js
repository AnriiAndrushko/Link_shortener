//import Head from 'next/head'
//import Image from 'next/image'
//import { Inter } from 'next/font/google'
import styles from '@/styles/inputForm.module.css'
import React, {useEffect, useRef, useState} from "react";
import connectMongo from "../../utils/connectMongo";
import Urls from "../../models/urls";
//const inter = Inter({ subsets: ['latin'] })
//import InputForm from '../../modules/inputForm'

async function getIP() {

    if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development'){    //This used to test on dev server and not run build every time
        let data;
        try {
            const response = await fetch('https://geolocation-db.com/json/');
            data = await response.json();
        }catch (err){
            console.log(err);
        }
        return data?data.IPv4:"All";
    }else{
        let ip;
        try {
            const response = await fetch("/api/getIP",{
                method:"GET",
                headers:{
                    "content-type":"application/json",
                },
            });
            ip = await response.json()
        }catch (err){
            console.log(err);
        }
        return ip?ip:"All";
    }
}

export default function Home({urlList}) {
    const [data,setData] = useState(urlList);
    const [newUrl, setNewUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);//currently not used, for future
    let userIP = useRef("All");

    useEffect(()=>{
        setIsLoading(true);
        const gettingIP = async ()=>{
            let ip = await getIP();
            userIP.current = ip;
            return ip;
        }
        gettingIP().then(()=>{
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
                <h3>Your IP: {userIP.current}</h3>
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
    await connectMongo();
    let urlList = await Urls.find({owner: 'All'});
    urlList= JSON.parse(JSON.stringify(urlList));//weird but works :/
    return{
        props:{
            urlList,
        },
    };
}



