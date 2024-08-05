"use server";
import { revalidatePath } from "next/cache";
import PinataSDK from "@pinata/sdk";
import { Readable } from "stream";

const pinata = new PinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET)


export async function uploadFile(formData: FormData) {
    try {
        const file = formData.get("file") as File;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);        
        const result = await pinata.pinFileToIPFS(stream, {pinataMetadata: {name: file.name}});
        console.log(result);
        revalidatePath("/");
        return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
    } catch (error) {
        console.log(error)
    }

}

export async function uploadJson(name: string, symbol: string, description: string, image: string) {
    try {
        const metadata ={
            name: name, 
            symbol: symbol,
            description: description,
            image: image,
            attributes: []
        }
        console.log(metadata)
        const result = await pinata.pinJSONToIPFS(metadata, {pinataMetadata: {name: name}});

        console.log(result);

        return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;

    } catch (error) {
        console.log(error)
    }
    
}