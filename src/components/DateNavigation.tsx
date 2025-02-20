'use client';

import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DateNavigationProps {
  selectedDate: Date;
  previousDate: string;
  nextDate: string;
}

export default function DateNavigation({ selectedDate, previousDate, nextDate }: DateNavigationProps) {
  return (
    <div className="p-4 border-b border-[var(--border-color)]">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => window.location.href = `/?date=${previousDate}`}
          className="p-2 hover:bg-[var(--accent-color)] rounded-md transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(selectedDate, 'EEEE, MMMM d')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  window.location.href = `/?date=${format(date, 'yyyy-MM-dd')}`;
                }
              }}
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          onClick={() => window.location.href = `/?date=${nextDate}`}
          className="p-2 hover:bg-[var(--accent-color)] rounded-md transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
} 