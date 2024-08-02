"use client"

import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";


const API_KEY =process.env.NEXT_PUBLIC_GEMINI_API

export default function Home() {
  const [code, setCode] = useState ('');
  const [isSending, setIsSending] = useState (false);
  const [explanation, setExplanation] = useState('')
  const trainingPrompt = [
    {
    "parts":[
    {
      "text" : "Now I want you to act as a code explainer, if I give you a piece of code then you have to explain me the code in a single reponse. You have to explain each and every lines of code one by one and give the explaination in a different lines for each different line of code. Just give me the explanation of the given code don't give anything else. Do not  give response to the other input. If someone give something else other than code , you should give the response that'please give only code'"
    }],
    role:'user'
  },
  {
    "parts":[
    {
      "text" : "okay"
    }],
    role:'model'
  }
  ]




  const explainthiscode = async ()=>{
    let url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key="+ API_KEY
    let messageToSend =[
      ...trainingPrompt,
      {
        "parts":[
        {
          "text" : code
        }],
        role:'user'
      }

    ]

    setIsSending(true)

    let res = await fetch(url,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "contents" : messageToSend
      })
    })

    let resjson = await res.json()
    setIsSending(false)

    let responseMessage = resjson.candidates[0].content.parts[0].text
    // console.log(responseMessage)
    setExplanation(responseMessage)
    console.log(responseMessage)
  }
  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <textarea className={styles.input} placeholder="Write your code here..."
        value={code}
        onChange={(e)=> setCode(e.target.value)}/>

        {
          explanation.length>0 ?
          <p className={styles.fixed}>
            <span style={{ whiteSpace: 'pre-wrap' }}>{explanation}</span>
          </p>
          :
          <p className={styles.notfixed}>
            Promt is empty...
          </p>
        }
      </div>
      {
        isSending ?
        <button className={styles.button}>
          Sending...
        </button>
        :
        <button className={styles.button} onClick={explainthiscode}>
          Explain
        </button>
      }
    </div>
  );
}
