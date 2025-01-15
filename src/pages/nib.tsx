import React, { useEffect, useRef } from 'react'
import nibPng from '../assets/nib.png'

interface Coordinate {
  x: number
  y: number
}

// 笔尖的偏移量
const nibOffset: Coordinate = { x: 63, y: 200 }

// 绘制笔尖
function drawNib({ ctx, nib, currentPoint }: { ctx: CanvasRenderingContext2D, nib: CanvasImageSource, currentPoint: Coordinate }) {
  ctx.drawImage(nib, currentPoint.x - nibOffset.x, currentPoint.y - nibOffset.y)
}

function drawPath({ ctx, startPoint, currentPoint }: { ctx: CanvasRenderingContext2D, startPoint: Coordinate, currentPoint: Coordinate }) {
  ctx.beginPath()
  ctx.moveTo(startPoint.x, startPoint.y)
  ctx.lineTo(currentPoint.x, currentPoint.y)
  ctx.stroke()
}

function setupCanvas(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
}

const startPoint: Coordinate = { x: 100, y: 300 }
const endPoint: Coordinate = { x: 700, y: 300 }

const loadImage: (src: string) => Promise<HTMLImageElement> = (src) => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.src = src
    image.onload = () => resolve(image)
    image.onerror = err => reject(err)
  })
}

const Hand: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const nibPngRef = useRef<HTMLImageElement | null>(null)
  const frameIdRef = useRef<number>(0)
  let progress = 0

  useEffect(() => {
    if (!canvasRef.current) {
      return
    }
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) {
      return
    }
    ctxRef.current = ctx

    ;(async () => {
      try {
        nibPngRef.current = await loadImage(nibPng)
        const animation = () => {
          ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)

          progress += 0.01

          if (progress > 1) {
            progress = 1
            drawPath({ ctx, startPoint, currentPoint: endPoint })
            drawNib({ ctx, nib: nibPngRef.current!, currentPoint: endPoint })
            cancelAnimationFrame(frameIdRef.current)
            return
          }

          const currentPoint = {
            x: startPoint.x + (endPoint.x - startPoint.x) * progress,
            y: startPoint.y + (endPoint.y - startPoint.y) * progress,
          }

          drawPath({ ctx, startPoint, currentPoint })
          drawNib({ ctx, nib: nibPngRef.current!, currentPoint })

          frameIdRef.current = requestAnimationFrame(animation)
        }

        const startAnimation = () => {
          progress = 0
          animation()
        }

        setupCanvas(ctxRef.current!)
        startAnimation()
      }
      catch {

      }
    })()
  }, [])

  return (
    <div className="relative w-screen h-screen">
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </div>
  )
}

export default Hand
