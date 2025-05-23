import { useCallback, useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import './App.css'
import { toast, Toaster } from "sonner"
import Table from './components/Table';
import type { Comment } from './types'
import axios from 'axios'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationEllipsis,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { getPaginationRange } from './utils'
import { SearchBar } from './components/SearchInput'

const apiUrl = import.meta.env.VITE_API_URL

const LIMIT = 10

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [params, setParams] = useState({ page: 1, totalPages: 1, query: '' });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return toast("No file selected!");

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`${apiUrl}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      toast('File uploaded')
      fetchComments()
    } catch (error) {
      console.error(error);
      toast('Upload unsuccessfully')
    }
  };

  const fetchComments = useCallback(
    async () => {
      const search = params.query ? `&q=${params.query}` : ''
      try {
        const res = await axios.get(`${apiUrl}?page=${params.page}&limit=${LIMIT}${search}`)
        setComments(res.data.data)
        setParams(prev => ({ ...prev, totalPages: res.data.totalPages }))
      } catch (error) {
        console.log(error);
        toast('Get comments unsuccessfully')
      }
    },
    [params.page, params.query],
  )

  const handleSearch = (val: string) => {
    setParams(prev => ({ ...prev, query: val }))
  }

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  return (
    <>
      <Card className="w-[350px] mb-7">
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Upload a CSV File</h2>
          <div className="flex flex-col space-y-4">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            />
            {/*  TODO widen "choose file" padding */}
            {/*  TODO add cursor-pointer effect the whole input */}
            <Button
              onClick={handleUpload}
            >
              Upload
            </Button>
          </div>
        </CardContent>
      </Card>
      <SearchBar value={params.query} onChange={handleSearch} />

      {comments.length === 0 ? "No data" :
        <>
          <Table comments={comments} />
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => setParams(prev => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
                  className={params.page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {getPaginationRange(params.page, params.totalPages).map((item, index) => (
                <PaginationItem key={index}>
                  {item === "..." ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      isActive={item === params.page}
                      onClick={() => setParams(prev => ({ ...prev, page: Number(item) }))}
                    >
                      {item}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => setParams(prev => ({
                    ...prev,
                    page: Math.min(prev.page + 1, prev.totalPages)
                  }))}
                  className={params.page === params.totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      }
      <Toaster />
    </>
  )
}

export default App
