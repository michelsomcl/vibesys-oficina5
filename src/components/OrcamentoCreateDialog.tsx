
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { OrcamentoForm } from "@/components/OrcamentoForm"

interface OrcamentoCreateDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export const OrcamentoCreateDialog = ({ isOpen, onOpenChange }: OrcamentoCreateDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Novo Orçamento
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Criar Novo Orçamento</DialogTitle>
        </DialogHeader>
        <OrcamentoForm 
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
