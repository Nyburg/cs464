"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material"
import { createBrowserClient } from "@/lib/supabase/createBrowserClient"
import { LogoutButton } from "@/components/supabase/logout-button"
import { APP_TITLE } from "@/constants/app"
import type { User } from "@supabase/supabase-js"

export function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [supabase] = useState(() => createBrowserClient())

  useEffect(() => {
    let mounted = true

    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (mounted) {
        setUser(data.user)
      }
    }

    fetchUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (mounted) {
        setUser(session?.user ?? null)
      }
    })

    return () => {
      mounted = false
      authListener.subscription.unsubscribe()
    }
  }, [supabase])

  const displayName =
    user?.user_metadata?.username ??
    user?.user_metadata?.name ??
    user?.email ??
    ""

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between", gap: 2 }}>
        <Box>
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
              {APP_TITLE}
            </Typography>
          </Link>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {user ? (
            <>
              <Typography variant="body1" sx={{ color: "text.primary" }}>
                {displayName}
              </Typography>
              <LogoutButton />
            </>
          ) : (
            <Button variant="contained" component={Link} href="/login">
              Log in
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
