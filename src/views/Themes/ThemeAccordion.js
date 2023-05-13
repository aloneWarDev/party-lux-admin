import React, { useCallback, useRef, useState } from "react";
// import PopoverPicker from "./PopoverPicker";
import { connect } from 'react-redux';
// import { createImage } from './Theme.action'
import { ENV } from "config/config";
import defaultImage from '../../../src/assets/img/faces/face-0.jpg';
import { Form } from 'react-bootstrap';
// import axios from 'axios'

import useOnClickOutside from 'use-onclickoutside';

const ThemeAccordion = ({ notes, BigState, setItem, InputChange, err }) => {
    const [image, setImage] = useState("")
    const [isOpen , toggle] = useState("")
    const popover = useRef();
    const close = useCallback(() => toggle(false), []);
    useOnClickOutside(popover, close);


    const fileSelectHandler = async (e) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = async () => {
            // 
            setImage(reader.result);

        };
        reader.readAsDataURL(files[0]);
    };

    const wordSplitter = (str) => {  //💌
        let final = ""
        const result = str.split(/(?=[A-Z])/);
        for (let letter in result) {
            final = final + (result[letter].charAt(0).toUpperCase() + result[letter].slice(1)).concat(' ')
        }
        return final
    }

    const Gradientline = (arr)=>{
        var res = ''
        if(arr.length <=0){
            return "#ffff"
        }
        for(let i=0 ; i<arr.length ; i++){
            if(arr[i].color !== ''){
                if(i!==arr.length-1){
                    res = (res + arr[i].color )+','
                }
                else{
                    res = (res + arr[i].color )
                }
            }
            else{
                if(i!==arr.length-1){
                    res = (res + '#ffff' )+','
                }
                else{
                    res = (res + '#ffff' )
                }
            }
        }
        if(res){
            return res
        }
    }


    const errorOption=(data,index)=>{
        let tmp =data;
        //   alert(JSON.stringify(data))
        //   alert(JSON.stringify(index))
        
        
        if(tmp){
            return <p className="error">{tmp[index]}</p>
        }
        //   return <p className="error">{tmp[index]}</p>
    }

    return (
        <>
            {BigState && Object.keys(BigState).map((key, i) => {
                return (
                    <li key={i}>
                        <div >
                            {key && <label className="form-label" style={{ "fontSize": "21px" }} > { wordSplitter(key) } {BigState[key].type === 'input' ?   <span className="text-danger">* must be between 0 to 1 </span> : '' }</label>}
                            {BigState[key].type === 'color' &&
                                <>
                                    <div className="d-flex flex-row">
                                        <div className="p-2">
                                            <div 
                                                className="swatch"
                                                style={{ backgroundColor: BigState[key].value ? BigState[key].value : '#ffff'   }}/>
                                        </div>
                                        <div className="p-2" style={{ width: "200px" }}>
                                            <Form.Control
                                                style={{ backgroundColor: "black " }}
                                                value={BigState[key].value ? BigState[key].value : '#ffffff' }
                                                name={[key]}
                                                onChange={
                                                    (e) => { 
                                                        setItem({ ...BigState, [key]: { value: e.target.value, type: "color" } }) 
                                                    }
                                                }
                                                type="color"
                                            ></Form.Control>
                                        </div>
                                    </div>
                                    {err && !BigState[key].value && <p className="error">{err[key]}</p>}

                                </>
                            }

                            {BigState[key].type === 'file' &&
                                <>
                                    {(BigState[key].value.length !== undefined || BigState[key].value.length != 0) && <img className="uploaded-img" src={BigState[key].value} onError={(e) => { e.target.onerror = null; e.target.src = defaultImage }} />}
                                    <input
                                        type="file"
                                        className="img-file"
                                        // input type file is un-controlled input that's why there is no value
                                        name={[key]}
                                        onChange={async (e) => { const res = await ENV.uploadImage(e); await fileSelectHandler(e); setItem({ ...BigState, [key]: { value: res ? res : "", type: "file" } }) }}
                                    />
                                    {err && !BigState[key].value.length && <p className="error">{err[key]}</p>}
                                </>
                            }
                            {
                                BigState[key].type === 'input' &&
                                <>
                                    <div className="p-2 " style={{ width: "200px" }} >
                                        <Form.Control
                                            style={{ backgroundColor: "black " }}
                                            value={BigState[key].value}
                                            name={[key]}
                                            placeholder="0.1" 
                                            onChange={
                                                (e) => { 
                                                    let val=e.target.value; 
                                                    
                                                    

                                                    if(BigState[key].regex )
                                                    {
                                                        let re = new RegExp(BigState[key].regex)
                                                        
                                                        if(re.test(val))
                                                        {
                                                            setItem({ ...BigState, [key]: { value: val, type: "input" , regex: BigState[key].regex } })
                                                        }
                                                        if(val === '')
                                                        {
                                                            setItem({ ...BigState, [key]: { value: val, type: "input" , regex: BigState[key].regex } })
                                                        }
                                                    }
                                                    else if(BigState[key].regex === undefined ){
                                                        setItem({ ...BigState, [key]: { value: val, type: "input" } })
                                                    }
                                                }
                                            }
                                            type="text"
                                        ></Form.Control>
                                    </div>
                                    {err && !BigState[key].value && <p className="error">{err[key]}</p>}
                                </>
                            }
                            {
                                BigState[key].type === 'gradient' &&
                                <>
                                    <div className="d-flex">
                                        <div 
                                            className="swatch"
                                            style={{ background: `linear-gradient(${Gradientline(BigState[key].value) })` }}
                                        />
                                    {
                                        BigState[key].value.length &&  BigState[key].value.map((item,index)=>{
                                            return(
                                                <div key={index}>
                                                    <div className="p-2 " style={{ width: "200px" }} >
                                                        <Form.Control
                                                            style={{ backgroundColor: "black " }}
                                                            value={BigState[key]?.value[index].color ? BigState[key]?.value[index].color : '#ffffff'}
                                                            name={index}
                                                            onChange={(e) => { 
                                                                    let val=BigState[key].value
                                                                    val[index]={color:e.target.value} 
                                                                    setItem({ ...BigState, [key]: { value: val, type: "gradient" } }) 
                                                                }
                                                            }
                                                            type="color"
                                                        ></Form.Control>
                                                    </div>
                                                    {err && !BigState[key].value[index].color &&
                                                        errorOption(err[key],index)
                                                    }
                                                </div>
                                            )
                                        })
                                        
                                    }
                                    </div>
                                </>
                            }

                        </div >
                        {notes[key] &&<p>{notes[key]}</p>}
                    </li>
                )
            })}
        </>
    )
}
const mapStateToProps = state => ({

})
export default connect(mapStateToProps, {})(ThemeAccordion);