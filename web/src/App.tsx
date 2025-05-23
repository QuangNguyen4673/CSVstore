import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import './App.css'
import { Toaster } from "sonner"

import Table from './components/Table';
import { infoItems } from './mockedData';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("No file selected!");

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      alert(`Upload success: ${JSON.stringify(result)}`);
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

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
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
            {message && (
              <p className="text-sm text-gray-700 bg-gray-100 p-2 rounded">{message}</p>
            )}
          </div>
        </CardContent>
      </Card>
      <Table infoItems={infoItems} />
      <Toaster />
    </>
  )
}

export default App
