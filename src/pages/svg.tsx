import React, { useEffect, useRef, useState } from 'react'
import { svgPathOfStar } from '../constants/svg-path-of-star'
import DrawPath from '../draw-path'

function drawCanvas({
  drawTool,
  ctx,
  times,
  splitsValue,
  path,
}: {
  drawTool: DrawPath
  ctx: CanvasRenderingContext2D
  times: number
  splitsValue: number
  path: string[]
}) {
  drawTool.clear()
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, 500, 500)
  ctx!.save()
  ctx!.strokeStyle = '#ff0000'
  ctx!.lineWidth = 1
  drawTool.config.times = times
  drawTool.setSplits(splitsValue)
  drawTool.setPath(path)
  drawTool.asCenter()
  drawTool.paintPoints()
  ctx!.restore()
}

const App: React.FC = () => {
  const [path] = useState<string[]>([svgPathOfStar])

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)

  const play = () => {
    drawCanvas({
      drawTool: new DrawPath(canvasRef.current!),
      ctx: ctxRef.current!,
      times: 10,
      splitsValue: 5,
      path,
    })
  }

  useEffect(() => {
    if (!canvasRef.current) {
      return
    }
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) {
      return
    }
    ctxRef.current = ctx
  }, [])

  return (
    <>
      <canvas
        className="w-500 h-500 border border-gray-300"
        width="500"
        height="500"
        ref={canvasRef}
      >
      </canvas>
      <button
        onClick={play}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        开始播放
      </button>
    </>

  )
}

export default App
