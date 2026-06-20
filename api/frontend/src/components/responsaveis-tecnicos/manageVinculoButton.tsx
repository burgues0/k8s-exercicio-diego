"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Edit, Trash2, AlertTriangle } from "lucide-react";
import { responsaveisTecnicosService } from "@/services/responsaveisTecnicosService";

interface VinculoData {
  data_inicio?: string;
  data_fim?: string;
  tipo_vinculo?: string;
}

interface ManageVinculoButtonProps {
  responsavelId: number;
  obraId: number;
  responsavelNome?: string;
  obraNome?: string;
  onSuccess?: () => void;
  variant?: "view" | "edit" | "delete";
}

export function ManageVinculoButton({
  responsavelId,
  obraId,
  responsavelNome,
  obraNome,
  onSuccess,
  variant = "view",
}: ManageVinculoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [vinculo, setVinculo] = useState<VinculoData>({});
  const [isEditing, setIsEditing] = useState(variant === "edit");

  useEffect(() => {
    if (isOpen && (variant === "view" || variant === "edit")) {
      loadVinculo();
    }
  }, [isOpen, variant]);

  const loadVinculo = async () => {
    try {
      setIsLoading(true);
      const data = await responsaveisTecnicosService.getVinculoEspecifico(responsavelId, obraId);
      setVinculo(data);
    } catch (error: any) {
      console.error("Erro ao carregar vínculo:", error);
      alert(error.message || "Erro ao carregar vínculo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      await responsaveisTecnicosService.updateVinculoEspecifico(responsavelId, obraId, vinculo);
      
      console.log("Vínculo atualizado com sucesso!");
      setIsOpen(false);
      onSuccess?.();
    } catch (error: any) {
      console.error("Erro ao atualizar vínculo:", error);
      alert(error.message || "Erro ao atualizar vínculo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await responsaveisTecnicosService.removeVinculoEspecifico(responsavelId, obraId);
      
      console.log("Vínculo removido com sucesso!");
      setIsOpen(false);
      onSuccess?.();
    } catch (error: any) {
      console.error("Erro ao remover vínculo:", error);
      alert(error.message || "Erro ao remover vínculo");
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonProps = () => {
    switch (variant) {
      case "edit":
        return {
          icon: <Edit className="h-4 w-4" />,
          text: "Editar Vínculo",
          className: "text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200",
        };
      case "delete":
        return {
          icon: <Trash2 className="h-4 w-4" />,
          text: "Remover Vínculo",
          className: "text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200",
        };
      default:
        return {
          icon: <Eye className="h-4 w-4" />,
          text: "Ver Vínculo",
          className: "text-gray-600 hover:text-gray-700 hover:bg-gray-50 border-gray-200",
        };
    }
  };

  const buttonProps = getButtonProps();

  const renderContent = () => {
    if (variant === "delete") {
      return (
        <>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Confirmar Remoção
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover o vínculo entre{" "}
              {responsavelNome && <strong>"{responsavelNome}"</strong>}
              {responsavelNome && obraNome && " e "}
              {obraNome && <strong>"{obraNome}"</strong>}
              ? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Removendo..." : "Confirmar Remoção"}
            </Button>
          </DialogFooter>
        </>
      );
    }

    return (
      <>
        <DialogHeader>
          <DialogTitle>
            {variant === "edit" || isEditing ? "Editar" : "Visualizar"} Vínculo
          </DialogTitle>
          <DialogDescription>
            {responsavelNome && obraNome && (
              <>Vínculo entre "{responsavelNome}" e "{obraNome}"</>
            )}
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="py-4 text-center">Carregando...</div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="data_inicio">Data de Início</Label>
              <Input
                id="data_inicio"
                type="date"
                value={vinculo.data_inicio || ""}
                onChange={(e) => setVinculo({ ...vinculo, data_inicio: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="data_fim">Data de Fim</Label>
              <Input
                id="data_fim"
                type="date"
                value={vinculo.data_fim || ""}
                onChange={(e) => setVinculo({ ...vinculo, data_fim: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="tipo_vinculo">Tipo de Vínculo</Label>
              <Select
                value={vinculo.tipo_vinculo || ""}
                onValueChange={(value) => setVinculo({ ...vinculo, tipo_vinculo: value })}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de vínculo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="responsavel_principal">Responsável Principal</SelectItem>
                  <SelectItem value="responsavel_auxiliar">Responsável Auxiliar</SelectItem>
                  <SelectItem value="consultor">Consultor</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            {isEditing ? "Cancelar" : "Fechar"}
          </Button>
          
          {variant === "view" && !isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
            >
              Editar
            </Button>
          )}
          
          {isEditing && (
            <Button
              onClick={handleUpdate}
              disabled={isLoading}
            >
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          )}
        </DialogFooter>
      </>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={buttonProps.className}
        >
          {buttonProps.icon}
          <span className="ml-2">{buttonProps.text}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
