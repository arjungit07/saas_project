import { Sparkles } from "lucide-react";

export default function UploadHeader() {
    return (<div className="flex flex-col items-center justify-center gap-6 text-center">
        <div className="relative p-px overflow-hidden rounded-full bg-linear-to-r from-rose-200 via rose-500 to-rose-800 animate-gradient-x group">
            <div className="flex items-center justify-center gap-2 bg-white rounded-full px-6 py-3 text-base font-medium shadow-sm">
                <Sparkles className="h-6 w-6 text-rose-500 animate-pulse mr-2" />
                <span className="text-rose-500 text-base">AI-Powered Content Creation</span>
            </div>
        </div>

        <div className="capitalize text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Start Uploading{' '}
            <span className="relative inline-block">
                <span className="relative z-10
px-2">Your PDF's</span>
                <span
                    className="absolute inset-0
bg-rose-200/50 -rotate-2 rounded-lg
transform -skew-y-1"
                    aria-hidden="true"
                ></span>
            </span>{' '}
        </div>
        <div className="mt-2 text-lg leading-8 text-gray-600 max-w-2xl">
            <p> Upload your PDF and let our AI do the magic!✨</p>
        </div>
    </div>
    )

}