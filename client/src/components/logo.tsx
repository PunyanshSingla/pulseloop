import { cn } from "@/lib/utils";

export default function Logo({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div className={cn("flex items-center gap-2 font-medium", className)} {...props}>
            PulseLoop
        </div>
    )
}