'use client';

import { Moon, Sun } from "lucide-react";
import { buttonVariants } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useTheme } from "next-themes";

export function ThemeSwitcher() {

    const { resolvedTheme, setTheme } = useTheme();
    
    return(
        <DropdownMenu>
            <DropdownMenuTrigger className={`${buttonVariants({ variant: "ghost", size: "icon" })} cursor-pointer`}>
                <Moon className="size-0 dark:size-4" />
                <Sun className="size-4 dark:size-0" />
                <span className="sr-only">Toggle theme</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}