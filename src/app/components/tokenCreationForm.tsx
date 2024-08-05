'use client'
import React, { useState } from 'react'
import Input from './ui/input';
import { uploadFile, uploadJson } from '@/lib/fileUpload';
import { LuUpload } from "react-icons/lu";
import { Button, Switch } from '@headlessui/react'
import { mintTokens } from '@/lib/mint-tokens';
import { useWallet } from '@solana/wallet-adapter-react';
import { BiLoader } from 'react-icons/bi';
import { toast } from 'sonner';

export default function TokenCreationForm() {
    const [image, setImage] = useState<null | FormData>(null);
    const [name, setName] = useState<null | string>(null);
    const [symbol, setSymbol] = useState<null | string>(null);
    const [decimals, setDecimals] = useState<null | number>(null);
    const [amount, setAmount] = useState<null | number>(null);
    const [description, setDescription] = useState<null | string>(null);
    const [freezeAuthority, setFreezeAuthority] = useState<boolean>(true);
    const [mintAuthority, setMintAuthority] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false)
    const { publicKey, connected, wallet } = useWallet()
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        if (e.target.files) {
            const form = new FormData
            form.append("file", e.target.files[0]);
            setImage(form)
            console.log(form.get('file'))
        }
  
    }

    const handleSumbmit = async () => {
        if (image && name && symbol && description && decimals && amount && publicKey ) {
            setLoading(true)
            const response = await fetch('/api/uploadFile', {
                method: 'POST',
                body: image
            })
            if (response) {
                const data = await response.json()
                const imageUri = data.imageUri
                const metadataUri = await uploadJson(name, symbol, description, imageUri);
                if (!metadataUri) {
                    toast.error('Server Error')
                    return
                }
                await mintTokens(publicKey, decimals, amount, name, symbol, metadataUri, mintAuthority, wallet!)
                setLoading(false)
            }

        } else {
            toast.warning("Please Fill out all fields")
        }
    }

  return (
    <div className='  w-[600px] mx-24 mobile:mx-0 bg-gradient-to-br from-purple-700 to to-blue-700 rounded-xl
     animated-border mobile:w-[300px]  '>
        <div className=' m-5 flex flex-col items-center '>
            <div className='  '> 
                <div className=' flex flex-col items-center'>
                    <div className=' flex items-center mobile:flex-col mobile:gap-1'>
                        <Input onChange={(e : React.ChangeEvent<HTMLInputElement>)=>{setName(e.target.value)}} placeholder='Solana' name='Token Name'/>
                        <Input onChange={(e : React.ChangeEvent<HTMLInputElement>)=>{setSymbol(e.target.value)}} placeholder='SOL' name='Symbol'/>
                    </div>
                    <div className=' flex items-center mt-2 mobile:flex-col mobile:gap-1'>
                        <Input onChange={(e : React.ChangeEvent<HTMLInputElement>)=>{setDecimals(Number(e.target.value))}} placeholder='9' name='Decimals'/>
                        <Input onChange={(e : React.ChangeEvent<HTMLInputElement>)=>{setAmount(Number(e.target.value))}} placeholder='1000000000' name='Supply'/>
                    </div>
                </div>
                <div className=' '>
                <div className=' relative  mt-3 mx-2  '>
                    <h1 className=' text-sm font-semibold mb-2'>Image</h1>
                    <input type="file" name="" className='hidden' id="file-upload" onChange={(e)=>{handleFileChange(e)}} />
                    <label  htmlFor="file-upload">
                        <div className=' ' >
                        <div className=' bg-zinc-900 rounded-xl w-full mobile:w-[240px]  h-[100px]  flex flex-col items-center justify-center'>
                            <LuUpload className=' w-[40px] h-[40px]' />
                            <h1>{image ? (image.get('file') as File).name.toString() : ''}</h1>
                        </div>
                        </div>
                    </label>
                </div>
                <div className=' my-2'>
                    <h1 className=' text-sm font-semibold mb-2'>Description</h1>
                        <textarea onChange={(e)=>{setDescription(e.target.value)}} className=' bg-zinc-900 rounded-xl focus:outline-none p-4  w-full placeholder:text-sm' name="" id=""></textarea>
                </div>
                <div className=' flex'>
                    <div className=' w-1/2'>
                        <h1 className=' text-lg mobile:text-sm font-semibold'>Revoke Freeze</h1>
                        <h1 className=' text-xs mt-2 mobile:text-[10px]'>Revoke Freeze allows you to create a liquidity pool</h1>
                        <Switch
                        checked={true}
                        onChange={()=>{}}
                        className="group relative flex mt-2 h-7 w-14 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-black"
                        >
                        <span
                            aria-hidden="true"
                            className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
                        />
                        </Switch>                    </div>
                    <div className=' w-1/2'>
                        <h1 className=' text-lg motion-safe:text-sm font-semibold'>Revoke Mint</h1>
                        <h1 className=' text-xs mt-2 mobile:text-[10px]'>Mint Authority allows you to increase tokens supply</h1>
                        <Switch
                        checked={mintAuthority}
                        onChange={(e)=>{setMintAuthority(!mintAuthority)}}
                        className="group relative flex mt-2 h-7 w-14 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-black"
                        >
                        <span
                            aria-hidden="true"
                            className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
                        />
                        </Switch> 
                    </div>
                    </div>
                </div>
            </div>
            <div className=' mt-4'>
                <Button onClick={handleSumbmit} disabled={!connected} 
                    className=' bg-violet-800 p-4 px-8 rounded-xl hover:bg-opacity-40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50'>
                    {loading ?  <BiLoader className=' animate-spin'/> : connected ? 'Create Token' :   'Connect Wallet'}
                </Button>
            </div>
        </div>
    </div>
  )
}
