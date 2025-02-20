"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X } from "lucide-react"

interface Param {
  key: string
  value: string
}

export default function ApiTester() {
  const [url, setUrl] = useState("")
  const [method, setMethod] = useState("GET")
  const [params, setParams] = useState<Param[]>([{ key: "", value: "" }])
  const [headers, setHeaders] = useState("")
  const [body, setBody] = useState("")
  const [response, setResponse] = useState("")

  const handleAddParam = () => {
    setParams([...params, { key: "", value: "" }])
  }

  const handleRemoveParam = (index: number) => {
    const newParams = params.filter((_, i) => i !== index)
    setParams(newParams)
  }

  const handleParamChange = (index: number, field: "key" | "value", value: string) => {
    const newParams = [...params]
    newParams[index][field] = value
    setParams(newParams)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const options: RequestInit = {
        method,
        headers: headers ? JSON.parse(headers) : undefined,
        body: method !== "GET" && body ? body : undefined,
      }

      let fullUrl = url
      if (params.length > 0 && method === "GET") {
        const queryParams = new URLSearchParams()
        params.forEach((param) => {
          if (param.key && param.value) {
            queryParams.append(param.key, param.value)
          }
        })
        fullUrl += "?" + queryParams.toString()
      }

      const res = await fetch(fullUrl, options)
      const data = await res.text()
      setResponse(data)
    } catch (error) {
      setResponse("错误: " + (error as Error).message)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">API 测试工具</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="API URL" required />
        <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full p-2 border rounded">
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
        </select>
        <div>
          <h2 className="text-lg font-semibold mb-2">参数</h2>
          {params.map((param, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <Input
                type="text"
                value={param.key}
                onChange={(e) => handleParamChange(index, "key", e.target.value)}
                placeholder="键"
              />
              <Input
                type="text"
                value={param.value}
                onChange={(e) => handleParamChange(index, "value", e.target.value)}
                placeholder="值"
              />
              <Button type="button" variant="outline" size="icon" onClick={() => handleRemoveParam(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" onClick={handleAddParam} variant="outline" size="sm" className="mt-2">
            <Plus className="h-4 w-4 mr-2" /> 添加参数
          </Button>
        </div>
        <Textarea value={headers} onChange={(e) => setHeaders(e.target.value)} placeholder="请求头 (JSON 格式)" />
        <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="请求体" />
        <Button type="submit">发送请求</Button>
      </form>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>响应</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea value={response} readOnly className="h-64" />
        </CardContent>
      </Card>
    </div>
  )
}

