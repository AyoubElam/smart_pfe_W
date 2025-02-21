import * as React from "react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";

interface Jury {
  idJury: number;
  nom: string;
}

interface JurySelectorProps {
  selectedJuries: string[]; // Changed to an array of selected jurors
  onSelectJury: (jury: string) => void;
  jurys: Jury[];
  loading: boolean;
}

const JurySelector = ({ selectedJuries, onSelectJury, jurys, loading }: JurySelectorProps) => {
  const [open, setOpen] = React.useState(false);

  const selectedJuryNames = React.useMemo(() => {
    return selectedJuries.map((juryId) => {
      const jury = jurys.find((j) => j.nom === juryId);
      return jury ? jury.nom : "Sélectionner un jury";
    }).join(", ");
  }, [jurys, selectedJuries]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="flex items-center gap-4 w-full justify-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-center text-center hover:bg-secondary/50">
            <span className="truncate">{selectedJuryNames || "Sélectionner un jury"}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Rechercher un jury..." />
            <CommandList>
              <CommandEmpty>Aucun jury trouvé.</CommandEmpty>
              <CommandGroup heading="Jurys disponibles">
                {jurys.map((jury) => (
                  <CommandItem
                    key={jury.idJury}
                    value={jury.nom}
                    onSelect={(currentValue) => {
                      // Only allow selection if fewer than 2 jurors are selected
                      if (selectedJuries.length < 2 || selectedJuries.includes(currentValue)) {
                        onSelectJury(currentValue);
                      }
                      setOpen(false);
                    }}
                    className="text-center"
                  >
                    <Check className={`mr-2 h-4 w-4 ${selectedJuries.includes(jury.nom) ? "opacity-100" : "opacity-0"}`} />
                    {jury.nom}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default JurySelector;
