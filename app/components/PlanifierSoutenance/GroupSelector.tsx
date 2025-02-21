/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Group {
  idGroupe: string;
  nomGroupe: string;
  nbEtudiants: number;
}

interface GroupSelectorProps {
  groups: Group[];
  selectedGroup: string;
  onSelectGroup: (groupId: string) => void;
}

export default function GroupSelector({ groups, selectedGroup, onSelectGroup }: GroupSelectorProps) {
  const [open, setOpen] = React.useState(false);

  const selectedGroupName = React.useMemo(() => {
    const group = groups.find((g) => g.idGroupe === selectedGroup);
    return group ? `${group.nomGroupe} (${group.nbEtudiants} étudiants)` : "Sélectionner un groupe";
  }, [groups, selectedGroup]);

  return (
    <div className="flex items-center gap-4 w-full justify-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-center text-center hover:bg-secondary/50"
          >
            <span className="truncate">{selectedGroupName}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Rechercher un groupe..." />
            <CommandList>
              <CommandEmpty>Aucun groupe trouvé.</CommandEmpty>
              <CommandGroup heading="Groupes disponibles">
                {groups.map((group) => (
                  <CommandItem
                    key={group.idGroupe}
                    value={group.idGroupe}
                    onSelect={() => {
                      onSelectGroup(group.idGroupe);
                      setOpen(false);
                    }}
                    className="text-center"
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${selectedGroup === group.idGroupe ? "opacity-100" : "opacity-0"}`}
                    />
                    {group.nomGroupe}
                    <span className="ml-2 text-sm text-muted-foreground">({group.nbEtudiants} étudiants)</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
