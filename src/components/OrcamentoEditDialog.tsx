
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { OrcamentoForm } from "@/components/OrcamentoForm"

interface OrcamentoEditDialogProps {
  orcamento: any
  isOpen: boolean
  onClose: () => void
}

export const OrcamentoEditDialog = ({ orcamento, isOpen, onClose }: OrcamentoEditDialogProps) => {
  if (!orcamento) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Editar Orçamento - {orcamento.numero}</DialogTitle>
        </DialogHeader>
        <OrcamentoForm 
          orcamento={orcamento} 
          onSuccess={onClose}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}
