import {
    DatePicker as AriaDatePicker,
    DatePickerProps as AriaDatePickerProps,
    DateValue,
    Dialog,
    Popover,
    Button,
    Calendar,
    CalendarGrid,
    CalendarCell,
    Heading,
    DateInput,
    DateSegment,
    Group,
    CalendarGridHeader,
    CalendarHeaderCell,
    CalendarGridBody
} from 'react-aria-components';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getLocalTimeZone, today } from '@internationalized/date';

export interface DatePickerProps<T extends DateValue> extends AriaDatePickerProps<T> {
    className?: string;
}

export function DatePicker<T extends DateValue>({ className, ...props }: DatePickerProps<T>) {
    return (
        <AriaDatePicker {...props} className={cn("group flex flex-col gap-1 w-full", className)}>
            <div className="flex h-10 w-full items-center rounded-lg border border-line bg-surface px-3 py-2 text-sm ring-offset-surface focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:border-primary/50 transition-colors">
                <Group className="flex flex-1 items-center justify-between h-full">
                    <DateInput className="flex flex-1 py-0 bg-transparent border-none text-txt outline-none h-full items-center">
                        {(segment) => (
                            <DateSegment
                                segment={segment}
                                className="px-0.5 tabular-nums text-txt outline-none rounded-sm focus:bg-primary focus:text-white caret-transparent placeholder-secondary"
                            />
                        )}
                    </DateInput>
                    <Button className="outline-none text-secondary group-focus-within:text-primary transition-colors cursor-pointer flex items-center justify-center">
                        <CalendarIcon className="w-4 h-4 ml-2" />
                    </Button>
                </Group>
            </div>

            <Popover className="p-0 overflow-auto rounded-xl border border-line bg-paper text-text shadow-md data-[entering]:animate-in data-[exiting]:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95">
                <Dialog className="outline-none p-3">
                    <Calendar className="outline-none">
                        <header className="flex items-center justify-between pb-4">
                            <Button slot="previous" className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-surface text-secondary hover:text-txt outline-none transition-colors">
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Heading className="font-semibold text-sm" />
                            <Button slot="next" className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-surface text-secondary hover:text-txt outline-none transition-colors">
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </header>
                        <CalendarGrid className="border-collapse">
                            <CalendarGridHeader>
                                {(day) => (
                                    <CalendarHeaderCell className="text-xs text-secondary font-medium pb-2 w-9 h-9">
                                        {day}
                                    </CalendarHeaderCell>
                                )}
                            </CalendarGridHeader>
                            <CalendarGridBody>
                                {(date) => (
                                    <CalendarCell
                                        date={date}
                                        className={({ isSelected, isFocusVisible, isHovered, isPressed, isOutsideVisibleRange, isDisabled }) => cn(
                                            "w-9 h-9 rounded-md flex items-center justify-center text-sm outline-none transition-colors cursor-default",
                                            isOutsideVisibleRange ? "hidden" : "text-txt", // Hide outside range days
                                            isHovered && !isSelected && "bg-surface",
                                            isPressed && !isSelected && "bg-primary/20",
                                            isSelected ? "bg-primary text-white hover:bg-primary/90" : "",
                                            isFocusVisible && "ring-2 ring-primary ring-offset-1 ring-offset-paper",
                                            isDisabled && "text-muted-foreground opacity-30 cursor-not-allowed"
                                        )}
                                    />
                                )}
                            </CalendarGridBody>
                        </CalendarGrid>
                    </Calendar>
                </Dialog>
            </Popover>
        </AriaDatePicker>
    );
}


