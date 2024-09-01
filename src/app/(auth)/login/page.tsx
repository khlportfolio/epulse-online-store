import { Metadata } from "next"
import Link from "next/link"
import LoginForm from "./LoginForm"
import loginImage from "@/assets/login-image.jpg"
import Image from "next/image"

export const metadata: Metadata = {
    title: "Login"
}

const Login = () => {
    return (
        <main className="flex h-screen items-center justify-center p-5">
            <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
                <div className="md:w-1/2 w-full space-y-10 overflow-y-auto p-10">
                    <h1 className="text-3xl text-center font-bold">Login to Epulse</h1>
                    <div className="space-y-5">
                        <LoginForm />
                        <Link href="/signup" className="block text-center hover:underline">
                            Don&apos;t have an account?Sign up
                        </Link>
                    </div>
                </div>
                <Image
                    src={loginImage}
                    alt="Login image"
                    className="hidden w-1/2 object-cover md:block"
                />
            </div>
        </main>
    )
}

export default Login