import PinataSDK from "@pinata/sdk";
import { NextRequest, NextResponse } from "next/server";
import fs from 'fs'
import { uploadFile, uploadJson } from "@/lib/fileUpload";


export async function POST( req: NextRequest, res: NextResponse) {
    const formData = await req.formData()
    try {
        const imageUri = await uploadFile(formData);
        console.log(imageUri)
        return NextResponse.json({imageUri})
 
    } catch (error) {
        console.log(error)
    }
}