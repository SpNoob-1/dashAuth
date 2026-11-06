"use client"

interface HeadingProps {
    Title: string;
    Description: string;
}

const Heading = ({ Title, Description }: HeadingProps) => {
    return (
        <div>
            <h2 className="text-3xl font-bold tracking-tight">{Title}</h2>
            <p className="text-sm text-muted-foreground">{Description}</p>
        </div>
    )
}

export default Heading;