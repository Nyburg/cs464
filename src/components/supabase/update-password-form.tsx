"use client"

import { Alert, Box, Button, Card, CardContent, CardHeader, Stack, TextField, Typography } from "@mui/material"
import { useState, type FormEvent } from "react"
import { createBrowserClient } from "@/lib/supabase/createBrowserClient"
import { useRouter } from "next/navigation"

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [supabase] = useState(() => createBrowserClient())
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      router.push("/")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }} className={className} {...props}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: 1,
          borderColor: "divider",
          boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
          overflow: "hidden",
        }}
      >
        <CardHeader
          sx={{pb: 1, textAlign: "center",}}
          title={<Typography variant="h5" component="h1" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}> Update Your Password </Typography>}
          subheader="Enter a new password below to update your account"
        />
        <CardContent>
          <Stack component="form" spacing={2.5} onSubmit={handleForgotPassword}>
            <TextField
              label="New password"
              id="password"
              type="password"
              placeholder="New password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            />
            {error ? <Alert severity="error">{error}</Alert> : null}
            <Button type="submit" variant="contained" size="large" disabled={isLoading} fullWidth>
              {isLoading ? "Saving..." : "Save new password"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
