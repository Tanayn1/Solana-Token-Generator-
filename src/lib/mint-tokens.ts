import { AuthorityType, createAssociatedTokenAccountInstruction, createInitializeMintInstruction, createMintToCheckedInstruction, createMintToInstruction, createSetAuthorityInstruction, getAssociatedTokenAddress, getMinimumBalanceForRentExemptMint, MINT_SIZE, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { KeystoneWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl, Connection, Keypair, PublicKey, sendAndConfirmRawTransaction, sendAndConfirmTransaction, SystemProgram, Transaction, LAMPORTS_PER_SOL } from "@solana/web3.js"
import {   createCreateMetadataAccountV3Instruction, PROGRAM_ID, } from '@metaplex-foundation/mpl-token-metadata'
import { Wallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";

export async function mintTokens(publicKey: PublicKey, decimals: number, amount: number, 
    name: string, symbol: string, uri: string, revokeMintBool: boolean, wallet: Wallet) {
    try {
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const mintKeypair = Keypair.generate();
        const platformAdressBase58 = process.env.NEXT_PUBLIC_PLATFORM_WALLET_ADDRESS;
        const platformPublicKey = new PublicKey(platformAdressBase58!);


        if (!wallet.adapter.connected) {
            throw new Error("Wallet is not connected");
        }

        const tokenATA = await getAssociatedTokenAddress(
            mintKeypair.publicKey,
            publicKey
        );

        console.log('Associated Token Adress', tokenATA)

        const metadataInstruction = createCreateMetadataAccountV3Instruction(
        {
            metadata: PublicKey.findProgramAddressSync(
                [
                  Buffer.from("metadata"),
                  PROGRAM_ID.toBuffer(),
                  mintKeypair.publicKey.toBuffer(),
                ],
                PROGRAM_ID
              )[0],
            mint: mintKeypair.publicKey,
            mintAuthority: publicKey,
            payer: publicKey,
            updateAuthority: publicKey,
        }, {
            createMetadataAccountArgsV3: {
                data: {
                    name: name,
                    symbol: symbol,
                    uri: uri,
                    creators: null,
                    sellerFeeBasisPoints: 0,
                    uses: null,
                    collection: null,
                },
                isMutable: true,
                collectionDetails: null
            }
        }
    )

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: platformPublicKey,
                lamports: 0.5 * LAMPORTS_PER_SOL 
            }),
            SystemProgram.createAccount({
                fromPubkey: publicKey,
                newAccountPubkey: mintKeypair.publicKey,
                space: MINT_SIZE,
                lamports: await getMinimumBalanceForRentExemptMint(connection),
                programId: TOKEN_PROGRAM_ID
            }),
            createInitializeMintInstruction(
                mintKeypair.publicKey,
                decimals,
                publicKey,
                publicKey,
                TOKEN_PROGRAM_ID
            ),
            createAssociatedTokenAccountInstruction(
                publicKey,
                tokenATA,
                publicKey,
                mintKeypair.publicKey
            ),
            createMintToCheckedInstruction(
                mintKeypair.publicKey,
                tokenATA,
                publicKey,
                amount * Math.pow(10, decimals),
                decimals
            ),
            metadataInstruction,

            createSetAuthorityInstruction(
                mintKeypair.publicKey,
                publicKey,
                AuthorityType.FreezeAccount,
                null
            )
        );

        if (revokeMintBool === true) {
            transaction.add(
                createSetAuthorityInstruction(
                    mintKeypair.publicKey,
                    publicKey,
                    AuthorityType.MintTokens,
                    null
                )
            )
        }
        
       const signature =  await wallet.adapter.sendTransaction(transaction, connection, {
        signers: [mintKeypair]
       })
        console.log('signiture', signature)
        toast.success(`Success, Transaction Signature: ${signature}`)
        
        
    } catch (error) {
        console.log(error)
    }
}