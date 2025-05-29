
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useClientes } from "@/hooks/useClientes"
import { usePecas } from "@/hooks/usePecas"
import { useServicos } from "@/hooks/useServicos"
import { useCreateOrcamento, useUpdateOrcamento } from "@/hooks/useOrcamentos"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const orcamentoSchema = z.object({
  cliente_id: z.string().min(1, "Cliente é obrigatório"),
  veiculo_info: z.string().optional(), // Campo para mostrar info do veículo (read-only)
  data_orcamento: z.string().min(1, "Data do orçamento é obrigatória"),
  validade: z.string().min(1, "Validade é obrigatória"),
})

type OrcamentoFormData = z.infer<typeof orcamentoSchema>

interface OrcamentoFormProps {
  orcamento?: any
  onSuccess?: () => void
  onCancel?: () => void
}

export const OrcamentoForm = ({ orcamento, onSuccess, onCancel }: OrcamentoFormProps) => {
  const [selectedClienteId, setSelectedClienteId] = useState(orcamento?.cliente_id || "")
  const [selectedCliente, setSelectedCliente] = useState<any>(null)
  
  const { data: clientes = [] } = useClientes()
  const { data: pecas = [] } = usePecas()
  const { data: servicos = [] } = useServicos()
  
  const createOrcamento = useCreateOrcamento()
  const updateOrcamento = useUpdateOrcamento()

  const form = useForm<OrcamentoFormData>({
    resolver: zodResolver(orcamentoSchema),
    defaultValues: {
      cliente_id: orcamento?.cliente_id || "",
      veiculo_info: "",
      data_orcamento: orcamento?.data_orcamento || new Date().toISOString().split('T')[0],
      validade: orcamento?.validade || "",
    },
  })

  // Atualiza as informações do cliente selecionado
  useEffect(() => {
    if (selectedClienteId) {
      const cliente = clientes.find(c => c.id === selectedClienteId)
      setSelectedCliente(cliente)
      
      if (cliente && cliente.marca && cliente.modelo) {
        const veiculoInfo = `${cliente.marca} ${cliente.modelo} ${cliente.ano} - ${cliente.placa}`
        form.setValue("veiculo_info", veiculoInfo)
      } else {
        form.setValue("veiculo_info", "")
      }
    } else {
      setSelectedCliente(null)
      form.setValue("veiculo_info", "")
    }
  }, [selectedClienteId, clientes, form])

  const onSubmit = async (data: OrcamentoFormData) => {
    try {
      if (orcamento) {
        await updateOrcamento.mutateAsync({
          id: orcamento.id,
          cliente_id: data.cliente_id,
          veiculo_id: selectedClienteId, // Usando o mesmo ID do cliente para compatibilidade
          data_orcamento: data.data_orcamento,
          validade: data.validade,
        })
      } else {
        await createOrcamento.mutateAsync({
          cliente_id: data.cliente_id,
          veiculo_id: selectedClienteId, // Usando o mesmo ID do cliente para compatibilidade
          data_orcamento: data.data_orcamento,
          validade: data.validade,
          numero: "", // Será gerado pelo trigger da database
          valor_total: 0,
          status: "Pendente",
        })
      }
      onSuccess?.()
    } catch (error) {
      console.error("Erro ao salvar orçamento:", error)
    }
  }

  const handleClienteChange = (clienteId: string) => {
    setSelectedClienteId(clienteId)
    form.setValue("cliente_id", clienteId)
  }

  const hasVeiculoInfo = selectedCliente && selectedCliente.marca && selectedCliente.modelo

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cliente_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <Select onValueChange={handleClienteChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="veiculo_info"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Veículo</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    value={
                      !selectedClienteId 
                        ? "Selecione um cliente primeiro"
                        : !hasVeiculoInfo
                        ? "Nenhum veículo cadastrado para este cliente"
                        : field.value
                    }
                    readOnly
                    className="bg-gray-50"
                    placeholder="Informações do veículo aparecerão aqui"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="data_orcamento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data do Orçamento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="validade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Validade</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-4">Peças</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-2">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Peça" />
                </SelectTrigger>
                <SelectContent>
                  {pecas.map((peca) => (
                    <SelectItem key={peca.id} value={peca.id}>
                      {peca.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input placeholder="Qtd" />
              <Input placeholder="Valor unit." />
              <Button variant="outline" type="button">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-4">Serviços</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-2">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Serviço" />
                </SelectTrigger>
                <SelectContent>
                  {servicos.map((servico) => (
                    <SelectItem key={servico.id} value={servico.id}>
                      {servico.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input placeholder="Horas" />
              <Input placeholder="Valor/hora" />
              <Button variant="outline" type="button">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            type="submit"
            disabled={createOrcamento.isPending || updateOrcamento.isPending}
            className="bg-primary hover:bg-primary/90"
          >
            {orcamento ? "Atualizar Orçamento" : "Salvar Orçamento"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
