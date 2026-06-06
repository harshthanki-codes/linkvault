export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          handle: string
          display_name: string | null
          bio: string | null
          created_at: string
        }
        Insert: {
          id: string
          handle: string
          display_name?: string | null
          bio?: string | null
        }
        Update: {
          handle?: string
          display_name?: string | null
          bio?: string | null
        }
      }
      bookmarks: {
        Row: {
          id: string
          user_id: string
          title: string
          url: string
          description: string | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          title: string
          url: string
          description?: string | null
          is_public?: boolean
        }
        Update: {
          title?: string
          url?: string
          description?: string | null
          is_public?: boolean
        }
      }
    }
  }
}
