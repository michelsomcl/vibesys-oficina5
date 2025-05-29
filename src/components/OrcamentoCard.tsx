
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Pencil, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from "lucide-react"
import { format } from "date-fns"

interface OrcamentoCardProps {
  orcamento: any
  onView: (orcamento: any) => void
  onEdit: (orcamento: any) => void
}

export const OrcamentoCard = ({ orcamento, onView, onEdit }: OrcamentoCardProps) => {
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

  return (
    <Card className="hover:shadow-lg transition-shadow">
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
              <Button variant="outline" size="sm" onClick={() => onView(orcamento)}>
                <Eye className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => onEdit(orcamento)}>
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
  )
}
