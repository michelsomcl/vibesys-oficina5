
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { 
  Plus, 
  Search, 
  Pencil, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Loader2
} from "lucide-react"
import { useOrcamentos, useDeleteOrcamento } from "@/hooks/useOrcamentos"
import { OrcamentoForm } from "@/components/OrcamentoForm"
import { format } from "date-fns"

const Orcamentos = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewingOrcamento, setViewingOrcamento] = useState<any>(null)
  const [editingOrcamento, setEditingOrcamento] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data: orcamentos = [], isLoading } = useOrcamentos()
  const deleteOrcamento = useDeleteOrcamento()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovado":
        return "bg-green-100 text-green-800"
      case "Pendente":
        return "bg-yellow-100 text-yellow-800"
      case "Reprovado":
        return "bg-red-100 text-red-800"
      case "Cancelado":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Aprovado":
        return <CheckCircle className="w-4 h-4" />
      case "Pendente":
        return <Clock className="w-4 h-4" />
      case "Reprovado":
        return <XCircle className="w-4 h-4" />
      case "Cancelado":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const filteredOrcamentos = orcamentos.filter(orcamento => {
    const matchesSearch = orcamento.numero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         orcamento.cliente?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || orcamento.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleView = (orcamento: any) => {
    setViewingOrcamento(orcamento)
  }

  const handleEdit = (orcamento: any) => {
    setEditingOrcamento(orcamento)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este orçamento?")) {
      deleteOrcamento.mutate(id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orçamentos</h1>
          <p className="text-muted-foreground">Gerencie orçamentos e aprovações</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
              onSuccess={() => setIsDialogOpen(false)}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número ou cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Aprovado">Aprovado</SelectItem>
                <SelectItem value="Reprovado">Reprovado</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Orçamentos */}
      <div className="grid gap-6">
        {filteredOrcamentos.map((orcamento) => (
          <Card key={orcamento.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{orcamento.numero}</CardTitle>
                    <Badge className={getStatusColor(orcamento.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(orcamento.status)}
                        {orcamento.status}
                      </div>
                    </Badge>
                  </div>
                  <div className="text-muted-foreground">
                    <p><strong>Cliente:</strong> {orcamento.cliente?.nome}</p>
                    <p><strong>Veículo:</strong> {orcamento.veiculo ? `${orcamento.veiculo.marca} ${orcamento.veiculo.modelo} ${orcamento.veiculo.ano} - ${orcamento.veiculo.placa}` : 'N/A'}</p>
                    <p><strong>Data:</strong> {format(new Date(orcamento.data_orcamento), 'dd/MM/yyyy')} | <strong>Validade:</strong> {format(new Date(orcamento.validade), 'dd/MM/yyyy')}</p>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div className="text-2xl font-bold text-primary">
                    R$ {orcamento.valor_total.toFixed(2).replace('.', ',')}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleView(orcamento)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(orcamento)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    {orcamento.status === "Aprovado" && (
                      <Button size="sm" className="bg-secondary hover:bg-secondary/90">
                        Gerar OS
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Peças */}
                <div>
                  <h4 className="font-medium mb-2">Peças</h4>
                  <div className="space-y-1">
                    {orcamento.orcamento_pecas?.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.quantidade}x {item.peca?.nome}</span>
                        <span>R$ {(item.quantidade * parseFloat(item.valor_unitario.toString())).toFixed(2).replace('.', ',')}</span>
                      </div>
                    )) || <span className="text-sm text-muted-foreground">Nenhuma peça</span>}
                  </div>
                </div>
                
                {/* Serviços */}
                <div>
                  <h4 className="font-medium mb-2">Serviços</h4>
                  <div className="space-y-1">
                    {orcamento.orcamento_servicos?.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.horas}h {item.servico?.nome}</span>
                        <span>R$ {(parseFloat(item.horas.toString()) * parseFloat(item.valor_hora.toString())).toFixed(2).replace('.', ',')}</span>
                      </div>
                    )) || <span className="text-sm text-muted-foreground">Nenhum serviço</span>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrcamentos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum orçamento encontrado.</p>
        </div>
      )}

      {/* Dialog para Visualizar Orçamento */}
      <Dialog open={!!viewingOrcamento} onOpenChange={(open) => !open && setViewingOrcamento(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Visualizar Orçamento - {viewingOrcamento?.numero}</DialogTitle>
          </DialogHeader>
          {viewingOrcamento && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Cliente</Label>
                  <p className="text-sm text-muted-foreground">{viewingOrcamento.cliente?.nome}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Veículo</Label>
                  <p className="text-sm text-muted-foreground">
                    {viewingOrcamento.veiculo ? `${viewingOrcamento.veiculo.marca} ${viewingOrcamento.veiculo.modelo} ${viewingOrcamento.veiculo.ano} - ${viewingOrcamento.veiculo.placa}` : 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Data do Orçamento</Label>
                  <p className="text-sm text-muted-foreground">{format(new Date(viewingOrcamento.data_orcamento), 'dd/MM/yyyy')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Validade</Label>
                  <p className="text-sm text-muted-foreground">{format(new Date(viewingOrcamento.validade), 'dd/MM/yyyy')}</p>
                </div>
              </div>

              <Separator />

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Peças</h3>
                  <div className="space-y-2">
                    {viewingOrcamento.orcamento_pecas?.map((item, index) => (
                      <div key={index} className="flex justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">{item.peca?.nome}</p>
                          <p className="text-sm text-muted-foreground">Qtd: {item.quantidade}</p>
                        </div>
                        <p className="font-medium">R$ {(item.quantidade * parseFloat(item.valor_unitario.toString())).toFixed(2).replace('.', ',')}</p>
                      </div>
                    )) || <p className="text-sm text-muted-foreground">Nenhuma peça</p>}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Serviços</h3>
                  <div className="space-y-2">
                    {viewingOrcamento.orcamento_servicos?.map((item, index) => (
                      <div key={index} className="flex justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">{item.servico?.nome}</p>
                          <p className="text-sm text-muted-foreground">Horas: {item.horas}</p>
                        </div>
                        <p className="font-medium">R$ {(parseFloat(item.horas.toString()) * parseFloat(item.valor_hora.toString())).toFixed(2).replace('.', ',')}</p>
                      </div>
                    )) || <p className="text-sm text-muted-foreground">Nenhum serviço</p>}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(viewingOrcamento.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(viewingOrcamento.status)}
                      {viewingOrcamento.status}
                    </div>
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="text-2xl font-bold text-primary">
                    R$ {viewingOrcamento.valor_total.toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para Editar Orçamento */}
      <Dialog open={!!editingOrcamento} onOpenChange={(open) => !open && setEditingOrcamento(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Editar Orçamento - {editingOrcamento?.numero}</DialogTitle>
          </DialogHeader>
          {editingOrcamento && (
            <OrcamentoForm 
              orcamento={editingOrcamento} 
              onSuccess={() => setEditingOrcamento(null)}
              onCancel={() => setEditingOrcamento(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Orcamentos
