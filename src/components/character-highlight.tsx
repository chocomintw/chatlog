'use client';

import { useEffect, useState } from 'react';
import { User, Users, Plus, X, Check, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useChatlogStore } from '@/store/chatlog-store';

export function CharacterHighlight() {
  const characterName = useChatlogStore((s) => s.characterName);
  const setCharacterName = useChatlogStore((s) => s.setCharacterName);
  const savedCharacters = useChatlogStore((s) => s.savedCharacters);
  const addSavedCharacter = useChatlogStore((s) => s.addSavedCharacter);
  const removeSavedCharacter = useChatlogStore((s) => s.removeSavedCharacter);
  const characterColoringEnabled = useChatlogStore((s) => s.characterColoringEnabled);
  const toggleCharacterColoring = useChatlogStore((s) => s.toggleCharacterColoring);
  const initFromStorage = useChatlogStore((s) => s.initFromStorage);

  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    initFromStorage();
  }, [initFromStorage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (characterName.trim()) {
        addSavedCharacter(characterName.trim());
      }
    }
  };

  const isSaved = characterName.trim() && savedCharacters.includes(characterName.trim());

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Label and Input container */}
      <div className="flex items-center gap-1.5">
        <Label
          htmlFor="character-name-input"
          className="text-xs font-medium text-muted-foreground whitespace-nowrap"
        >
          Character:
        </Label>

        <div className="relative flex items-center">
          <User className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            id="character-name-input"
            type="text"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Your character's name..."
            className="h-8 w-[160px] sm:w-[190px] pl-8 pr-14 text-xs font-medium rounded bg-background"
          />

          {/* Action buttons inside input */}
          <div className="absolute right-1 flex items-center gap-0.5">
            {characterName && !isSaved && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => addSavedCharacter(characterName.trim())}
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    aria-label="Save character name"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Save name to list</TooltipContent>
              </Tooltip>
            )}

            {characterName && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setCharacterName('')}
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    aria-label="Clear character name"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Clear</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>

      {/* Saved Characters Dropdown Popover */}
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
            aria-label="Saved characters"
            title="Saved character list"
          >
            <Users className="h-3.5 w-3.5" />
            {savedCharacters.length > 0 && (
              <span className="rounded bg-muted px-1 py-0.2 font-mono text-[10px] text-foreground">
                {savedCharacters.length}
              </span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-56 p-2 text-xs">
          <div className="mb-2 flex items-center justify-between border-b border-border pb-1.5">
            <span className="font-semibold text-foreground">Saved Characters</span>
            <span className="text-[11px] text-muted-foreground">
              {savedCharacters.length} total
            </span>
          </div>

          {savedCharacters.length === 0 ? (
            <div className="py-3 text-center text-muted-foreground">
              <p className="text-[11px]">No saved characters.</p>
              <p className="text-[10px] text-muted-foreground">
                Type a name and click + or press Enter to bookmark it.
              </p>
            </div>
          ) : (
            <div className="max-h-48 space-y-1 overflow-y-auto">
              {savedCharacters.map((name) => {
                const isCurrent = characterName.toLowerCase() === name.toLowerCase();
                return (
                  <div
                    key={name}
                    className={`flex items-center justify-between rounded px-2 py-1.5 transition-colors ${
                      isCurrent
                        ? 'bg-primary/10 font-medium text-foreground'
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setCharacterName(name);
                        setPopoverOpen(false);
                      }}
                      className="flex items-center gap-1.5 flex-1 text-left truncate"
                    >
                      {isCurrent && <Check className="h-3 w-3 text-primary shrink-0" />}
                      <span className="truncate">{name}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSavedCharacter(name);
                      }}
                      className="ml-1 p-0.5 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label={`Remove ${name}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Toggle Character Coloring Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant={characterColoringEnabled ? 'secondary' : 'outline'}
            size="sm"
            onClick={toggleCharacterColoring}
            className={`h-8 gap-1.5 px-2.5 text-xs font-medium transition-colors ${
              characterColoringEnabled
                ? 'border-border text-foreground font-semibold'
                : 'text-muted-foreground opacity-70'
            }`}
          >
            {characterColoringEnabled ? (
              <Eye className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
            ) : (
              <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            <span>{characterColoringEnabled ? 'Names: On' : 'Names: Off'}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[220px] text-center">
          {characterColoringEnabled
            ? "Your character's dialogue appears in white/primary radio; others are dimmed to light grey."
            : 'Character name coloring is disabled (all standard colors used).'}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
