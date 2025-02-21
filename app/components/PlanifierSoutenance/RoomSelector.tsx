/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";  // Removed Home icon
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Room {
  id: string;
  name: string;
}

interface RoomSelectorProps {
  rooms: Room[];
  selectedRoom: string;
  onSelectRoom: (location: string) => void;
}

export default function RoomSelector({ rooms, selectedRoom, onSelectRoom }: RoomSelectorProps) {
  const [open, setOpen] = React.useState(false);

  const selectedRoomName = React.useMemo(() => {
    const room = rooms.find((r) => r.id === selectedRoom);
    return room ? room.name : "Sélectionner une salle";
  }, [rooms, selectedRoom]);

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
            <span className="truncate">{selectedRoomName}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Rechercher une salle..." />
            <CommandList>
              <CommandEmpty>Aucune salle trouvée.</CommandEmpty>
              <CommandGroup heading="Salles disponibles">
                {rooms.map((room) => (
                  <CommandItem
                    key={room.id}
                    value={room.id}
                    onSelect={(currentValue) => {
                      onSelectRoom(currentValue);
                      setOpen(false);
                    }}
                    className="text-center"
                  >
                    <Check className={`mr-2 h-4 w-4 ${selectedRoom === room.id ? "opacity-100" : "opacity-0"}`} />
                    {room.name}
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
