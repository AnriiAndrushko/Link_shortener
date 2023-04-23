import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import React, {useEffect, useState} from "react";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    const [data,setData] = useState([]);
    const [newUrl, setNewUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    //on load
    useEffect(()=>{
        setIsLoading(true);
        fetch("/api/url").then(res=>res.json()).then(data=>{
            setData(data);
            console.log(data);//TODO: clear debug
            setIsLoading(false);
        })
    },[]);


    const handleOnSubmit = async (e)=> {
        e.preventDefault();
        const _newUrl = newUrl;
        setNewUrl("");

        const  response = await fetch("/api/url",{
            method:"POST",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify({url:_newUrl})
            });
        const content = await response.json()
        if(content){
            setData([content, ...data]);
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
                                        <a target="_blank" href={`/api/${urlObject.code}`}>
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
  )
}//TODO:different path
