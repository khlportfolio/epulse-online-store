'use client'

import { useState, useEffect } from 'react'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"


import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { decryptKey, encryptKey } from '@/lib/utils'
import { X } from 'lucide-react'


const PassKeyModal = () => {
    const [open, setOpen] = useState(true)
    const [passKey, setPassKey] = useState('')
    const [error, setError] = useState('')

    const router = useRouter()
    const path = usePathname()

    const closeModal = () => {
        setOpen(false)
        router.push('/')
    }

    const encryptedKey = typeof window !== 'undefined' ? window.localStorage.getItem('accessKey') : null

    useEffect(() => {
        const accessKey = encryptedKey && decryptKey(encryptedKey)
        if (path) {
            if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
                setOpen(false)
                router.push('/admin')
            } else {
                setOpen(true)
            }
        }
    }, [encryptedKey])

    const validatePasskey = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()

        if (passKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
            const encryptedKey = encryptKey(passKey)

            localStorage.setItem('accessKey', encryptedKey)

            setOpen(false)
        } else {
            setError('Invalid passkey. Please try again.')
        }
    }
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className="space-y-5 bg-background border-muted-foreground outline-none">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-start justify-between">
                        Admin Access Verification
                        <X size={20} onClick={() => closeModal()}
                            className="cursor-pointer" />
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        To access the admin page, please enter the passkey.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div>
                    <InputOTP maxLength={6} value={passKey} onChange={(value) => setPassKey(value)}>
                        <InputOTPGroup className="w-full flex justify-between">
                            <InputOTPSlot className='text-36-bold justify-center flex border border-muted-foreground rounded-lg size-16 gap-4' index={0} />
                            <InputOTPSlot className='text-36-bold justify-center flex border border-muted-foreground rounded-lg size-16 gap-4' index={1} />
                            <InputOTPSlot className='text-36-bold justify-center flex border border-muted-foreground rounded-lg size-16 gap-4' index={2} />
                            <InputOTPSlot className='text-36-bold justify-center flex border border-muted-foreground rounded-lg size-16 gap-4' index={3} />
                            <InputOTPSlot className='text-36-bold justify-center flex border border-muted-foreground rounded-lg size-16 gap-4' index={4} />
                            <InputOTPSlot className='text-36-bold justify-center flex border border-muted-foreground rounded-lg size-16 gap-4' index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                    {error && (
                        <p className='text-red-400 text-14-regular mt-4 flex justify-center'>{error}</p>
                    )}
                </div>

                <AlertDialogFooter>
                    <AlertDialogAction onClick={(e: any) => validatePasskey(e)} className="bg-primary text-white w-full">
                        Enter Admin Passkey
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}

export default PassKeyModal