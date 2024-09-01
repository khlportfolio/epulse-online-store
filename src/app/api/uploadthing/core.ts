import prisma from '@/lib/prisma'
import { createUploadthing, FileRouter } from 'uploadthing/next'

const f = createUploadthing()

export const fileRouter = {
  attachment: f({
    image: { maxFileSize: '16MB', maxFileCount: 5 },
    video: { maxFileSize: '64MB', maxFileCount: 5 },
  })
    .middleware(async () => {
      return {}
    })
    .onUploadComplete(async ({ file }) => {
      const media = await prisma.media.create({
        data: {
          url: file.url.replace(
            '/f/',
            `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
          ),
          type: file.type.startsWith('image') ? 'IMAGE' : 'VIDEO',
        },
      })

      return { mediaId: media.id }
    }),
} satisfies FileRouter

export type AppFileRouter = typeof fileRouter
