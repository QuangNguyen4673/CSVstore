import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Info } from "@/types";

export default function CSVTable({ infoItems }: { infoItems: Info[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Post Id</TableHead>
          <TableHead>Id</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Body</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {infoItems.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.postId}</TableCell>
            <TableCell>{item.id}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.email}</TableCell>
            <TableCell className="w-[480px] whitespace-normal">{item.body}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
