import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, Eye, Plus, Pencil, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

interface GolfClub {
  id: string;
  name: string;
  location: string;
  description: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  image_url: string | null;
}

interface Sponsor {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  package_type: string;
  active: boolean;
  display_order: number | null;
  expires_at: string | null;
}

interface WebsiteContent {
  id: string;
  page_key: string;
  section_key: string;
  content_type: string;
  content_nl: string;
  display_order: number | null;
  editable: boolean | null;
}

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [clubs, setClubs] = useState<GolfClub[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [content, setContent] = useState<WebsiteContent[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [warningReason, setWarningReason] = useState("");
  const [warningSeverity, setWarningSeverity] = useState<"warning" | "serious" | "blocked">("warning");

  // Club dialog state
  const [clubDialogOpen, setClubDialogOpen] = useState(false);
  const [editingClub, setEditingClub] = useState<GolfClub | null>(null);
  const [clubForm, setClubForm] = useState({
    name: "",
    location: "",
    description: "",
    website: "",
    phone: "",
    email: "",
    image_url: "",
  });

  // Sponsor dialog state
  const [sponsorDialogOpen, setSponsorDialogOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [sponsorForm, setSponsorForm] = useState({
    name: "",
    description: "",
    logo_url: "",
    website_url: "",
    contact_email: "",
    contact_phone: "",
    package_type: "bronze",
    active: true,
    display_order: 0,
    expires_at: "",
  });

  // Content dialog state
  const [contentDialogOpen, setContentDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<WebsiteContent | null>(null);
  const [contentForm, setContentForm] = useState({
    page_key: "",
    section_key: "",
    content_type: "text",
    content_nl: "",
    display_order: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }

    if (user) {
      checkAdminStatus();
    }
  }, [user, loading, navigate]);

  const checkAdminStatus = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (error) {
      console.error("Error checking admin status:", error);
      navigate("/");
      return;
    }

    if (!data) {
      toast.error("Je hebt geen admin rechten");
      navigate("/");
      return;
    }

    setIsAdmin(true);
    fetchUsers();
    fetchClubs();
    fetchSponsors();
    fetchContent();
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*, user_roles(role), memberships(type, status)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      toast.error("Kon gebruikers niet laden");
      return;
    }

    setUsers(data || []);
  };

  const fetchClubs = async () => {
    const { data, error } = await supabase
      .from("golf_clubs")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching clubs:", error);
      toast.error("Kon clubs niet laden");
      return;
    }

    setClubs(data || []);
  };

  const fetchSponsors = async () => {
    const { data, error } = await supabase
      .from("sponsors")
      .select("*")
      .order("display_order");

    if (error) {
      console.error("Error fetching sponsors:", error);
      toast.error("Kon sponsoren niet laden");
      return;
    }

    setSponsors(data || []);
  };

  const fetchContent = async () => {
    const { data, error } = await supabase
      .from("website_content")
      .select("*")
      .order("page_key, display_order");

    if (error) {
      console.error("Error fetching content:", error);
      toast.error("Kon content niet laden");
      return;
    }

    setContent(data || []);
  };

  const handleWarnUser = async () => {
    if (!selectedUser || !warningReason) {
      toast.error("Vul alle velden in");
      return;
    }

    const { error } = await supabase.from("user_warnings").insert({
      user_id: selectedUser.id,
      warned_by: user!.id,
      reason: warningReason,
      severity: warningSeverity,
    });

    if (error) {
      toast.error("Kon waarschuwing niet toevoegen");
      return;
    }

    if (warningSeverity === "blocked") {
      await supabase
        .from("profiles")
        .update({
          blocked: true,
          blocked_reason: warningReason,
          blocked_at: new Date().toISOString(),
        })
        .eq("id", selectedUser.id);
    }

    toast.success(
      warningSeverity === "blocked" 
        ? "Gebruiker geblokkeerd" 
        : "Waarschuwing toegevoegd"
    );
    setWarningReason("");
    setSelectedUser(null);
    fetchUsers();
  };

  const handleUnblockUser = async (userId: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({
        blocked: false,
        blocked_reason: null,
        blocked_at: null,
      })
      .eq("id", userId);

    if (error) {
      toast.error("Kon gebruiker niet deblokkeren");
      return;
    }

    toast.success("Gebruiker gedeblokkeerd");
    fetchUsers();
  };

  // Club CRUD functions
  const openClubDialog = (club?: GolfClub) => {
    if (club) {
      setEditingClub(club);
      setClubForm({
        name: club.name,
        location: club.location,
        description: club.description || "",
        website: club.website || "",
        phone: club.phone || "",
        email: club.email || "",
        image_url: club.image_url || "",
      });
    } else {
      setEditingClub(null);
      setClubForm({
        name: "",
        location: "",
        description: "",
        website: "",
        phone: "",
        email: "",
        image_url: "",
      });
    }
    setClubDialogOpen(true);
  };

  const handleSaveClub = async () => {
    if (!clubForm.name || !clubForm.location) {
      toast.error("Naam en locatie zijn verplicht");
      return;
    }

    const clubData = {
      name: clubForm.name,
      location: clubForm.location,
      description: clubForm.description || null,
      website: clubForm.website || null,
      phone: clubForm.phone || null,
      email: clubForm.email || null,
      image_url: clubForm.image_url || null,
    };

    if (editingClub) {
      const { error } = await supabase
        .from("golf_clubs")
        .update(clubData)
        .eq("id", editingClub.id);

      if (error) {
        toast.error("Kon club niet bijwerken");
        return;
      }
      toast.success("Club bijgewerkt");
    } else {
      const { error } = await supabase.from("golf_clubs").insert(clubData);

      if (error) {
        toast.error("Kon club niet toevoegen");
        return;
      }
      toast.success("Club toegevoegd");
    }

    setClubDialogOpen(false);
    fetchClubs();
  };

  const handleDeleteClub = async (id: string) => {
    if (!confirm("Weet je zeker dat je deze club wilt verwijderen?")) return;

    const { error } = await supabase.from("golf_clubs").delete().eq("id", id);

    if (error) {
      toast.error("Kon club niet verwijderen");
      return;
    }

    toast.success("Club verwijderd");
    fetchClubs();
  };

  // Sponsor CRUD functions
  const openSponsorDialog = (sponsor?: Sponsor) => {
    if (sponsor) {
      setEditingSponsor(sponsor);
      setSponsorForm({
        name: sponsor.name,
        description: sponsor.description || "",
        logo_url: sponsor.logo_url || "",
        website_url: sponsor.website_url || "",
        contact_email: sponsor.contact_email || "",
        contact_phone: sponsor.contact_phone || "",
        package_type: sponsor.package_type,
        active: sponsor.active ?? true,
        display_order: sponsor.display_order || 0,
        expires_at: sponsor.expires_at ? sponsor.expires_at.split("T")[0] : "",
      });
    } else {
      setEditingSponsor(null);
      setSponsorForm({
        name: "",
        description: "",
        logo_url: "",
        website_url: "",
        contact_email: "",
        contact_phone: "",
        package_type: "bronze",
        active: true,
        display_order: 0,
        expires_at: "",
      });
    }
    setSponsorDialogOpen(true);
  };

  const handleSaveSponsor = async () => {
    if (!sponsorForm.name || !sponsorForm.package_type) {
      toast.error("Naam en pakket type zijn verplicht");
      return;
    }

    const sponsorData = {
      name: sponsorForm.name,
      description: sponsorForm.description || null,
      logo_url: sponsorForm.logo_url || null,
      website_url: sponsorForm.website_url || null,
      contact_email: sponsorForm.contact_email || null,
      contact_phone: sponsorForm.contact_phone || null,
      package_type: sponsorForm.package_type,
      active: sponsorForm.active,
      display_order: sponsorForm.display_order,
      expires_at: sponsorForm.expires_at ? new Date(sponsorForm.expires_at).toISOString() : null,
    };

    if (editingSponsor) {
      const { error } = await supabase
        .from("sponsors")
        .update(sponsorData)
        .eq("id", editingSponsor.id);

      if (error) {
        toast.error("Kon sponsor niet bijwerken");
        return;
      }
      toast.success("Sponsor bijgewerkt");
    } else {
      const { error } = await supabase.from("sponsors").insert(sponsorData);

      if (error) {
        toast.error("Kon sponsor niet toevoegen");
        return;
      }
      toast.success("Sponsor toegevoegd");
    }

    setSponsorDialogOpen(false);
    fetchSponsors();
  };

  const handleDeleteSponsor = async (id: string) => {
    if (!confirm("Weet je zeker dat je deze sponsor wilt verwijderen?")) return;

    const { error } = await supabase.from("sponsors").delete().eq("id", id);

    if (error) {
      toast.error("Kon sponsor niet verwijderen");
      return;
    }

    toast.success("Sponsor verwijderd");
    fetchSponsors();
  };

  // Content CRUD functions
  const openContentDialog = (contentItem?: WebsiteContent) => {
    if (contentItem) {
      setEditingContent(contentItem);
      setContentForm({
        page_key: contentItem.page_key,
        section_key: contentItem.section_key,
        content_type: contentItem.content_type,
        content_nl: contentItem.content_nl,
        display_order: contentItem.display_order || 0,
      });
    } else {
      setEditingContent(null);
      setContentForm({
        page_key: "",
        section_key: "",
        content_type: "text",
        content_nl: "",
        display_order: 0,
      });
    }
    setContentDialogOpen(true);
  };

  const handleSaveContent = async () => {
    if (!contentForm.page_key || !contentForm.section_key || !contentForm.content_nl) {
      toast.error("Alle velden zijn verplicht");
      return;
    }

    const contentData = {
      page_key: contentForm.page_key,
      section_key: contentForm.section_key,
      content_type: contentForm.content_type,
      content_nl: contentForm.content_nl,
      display_order: contentForm.display_order,
      updated_by: user?.id,
      updated_at: new Date().toISOString(),
    };

    if (editingContent) {
      const { error } = await supabase
        .from("website_content")
        .update(contentData)
        .eq("id", editingContent.id);

      if (error) {
        toast.error("Kon content niet bijwerken");
        return;
      }
      toast.success("Content bijgewerkt");
    } else {
      const { error } = await supabase.from("website_content").insert(contentData);

      if (error) {
        toast.error("Kon content niet toevoegen");
        return;
      }
      toast.success("Content toegevoegd");
    }

    setContentDialogOpen(false);
    fetchContent();
  };

  const handleDeleteContent = async (id: string) => {
    if (!confirm("Weet je zeker dat je deze content wilt verwijderen?")) return;

    const { error } = await supabase.from("website_content").delete().eq("id", id);

    if (error) {
      toast.error("Kon content niet verwijderen");
      return;
    }

    toast.success("Content verwijderd");
    fetchContent();
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Beheer gebruikers, clubs, sponsoren en content</p>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Gebruikers ({users.length})</TabsTrigger>
            <TabsTrigger value="clubs">Golf Clubs ({clubs.length})</TabsTrigger>
            <TabsTrigger value="sponsors">Sponsoren ({sponsors.length})</TabsTrigger>
            <TabsTrigger value="content">Content ({content.length})</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Gebruikers Overzicht</CardTitle>
                <CardDescription>
                  Bekijk en beheer alle geregistreerde gebruikers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Naam</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Lidmaatschap</TableHead>
                      <TableHead>Handicap</TableHead>
                      <TableHead>Provincie</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Acties</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((userItem) => (
                      <TableRow key={userItem.id}>
                        <TableCell className="font-medium">
                          {userItem.first_name} {userItem.last_name}
                        </TableCell>
                        <TableCell>{userItem.email}</TableCell>
                        <TableCell>
                          {userItem.memberships?.[0] ? (
                            <Badge variant={userItem.memberships[0].type === "elite" ? "default" : "secondary"}>
                              {userItem.memberships[0].type}
                            </Badge>
                          ) : (
                            <Badge variant="outline">Geen</Badge>
                          )}
                        </TableCell>
                        <TableCell>{userItem.handicap || "-"}</TableCell>
                        <TableCell>{userItem.province || "-"}</TableCell>
                        <TableCell>
                          {userItem.blocked ? (
                            <Badge variant="destructive">Geblokkeerd</Badge>
                          ) : (
                            <Badge variant="secondary">Actief</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedUser(userItem)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-lg">
                                <DialogHeader>
                                  <DialogTitle>Gebruiker Details</DialogTitle>
                                  <DialogDescription>
                                    {userItem.first_name} {userItem.last_name}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">Email</Label>
                                      <p className="text-sm">{userItem.email}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Geslacht</Label>
                                      <p className="text-sm">{userItem.gender || "-"}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Provincie</Label>
                                      <p className="text-sm">{userItem.province || "-"}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Stad</Label>
                                      <p className="text-sm">{userItem.city || "-"}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Handicap</Label>
                                      <p className="text-sm">{userItem.handicap || "-"}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Golfclub</Label>
                                      <p className="text-sm">{userItem.golf_club || "-"}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Zoekt Relatie</Label>
                                      <p className="text-sm">{userItem.seeking_relationship ? "Ja" : "Nee"}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Aangemeld</Label>
                                      <p className="text-sm">
                                        {userItem.created_at 
                                          ? new Date(userItem.created_at).toLocaleDateString("nl-NL")
                                          : "-"}
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Bio</Label>
                                    <p className="text-sm text-muted-foreground">{userItem.bio || "Geen bio"}</p>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>

                            {userItem.blocked ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUnblockUser(userItem.id)}
                              >
                                Deblokkeer
                              </Button>
                            ) : (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedUser(userItem)}
                                  >
                                    <AlertTriangle className="w-4 h-4 mr-1" />
                                    Waarschuw
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Gebruiker Waarschuwen</DialogTitle>
                                    <DialogDescription>
                                      Waarschuw of blokkeer {userItem.first_name} {userItem.last_name}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label>Ernst</Label>
                                      <Select
                                        value={warningSeverity}
                                        onValueChange={(v: any) => setWarningSeverity(v)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="warning">Waarschuwing</SelectItem>
                                          <SelectItem value="serious">Serieuze Waarschuwing</SelectItem>
                                          <SelectItem value="blocked">Blokkeer Gebruiker</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label>Reden</Label>
                                      <Textarea
                                        placeholder="Beschrijf de reden voor deze actie..."
                                        value={warningReason}
                                        onChange={(e) => setWarningReason(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button onClick={handleWarnUser}>
                                      Bevestigen
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Golf Clubs Tab */}
          <TabsContent value="clubs">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Golf Clubs</CardTitle>
                  <CardDescription>Beheer partner golf clubs</CardDescription>
                </div>
                <Button onClick={() => openClubDialog()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nieuwe Club
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Naam</TableHead>
                      <TableHead>Locatie</TableHead>
                      <TableHead>Website</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Acties</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clubs.map((club) => (
                      <TableRow key={club.id}>
                        <TableCell className="font-medium">{club.name}</TableCell>
                        <TableCell>{club.location}</TableCell>
                        <TableCell>
                          {club.website ? (
                            <a href={club.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              Website
                            </a>
                          ) : "-"}
                        </TableCell>
                        <TableCell>{club.email || "-"}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => openClubDialog(club)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteClub(club.id)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {clubs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          Nog geen golf clubs toegevoegd
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Club Dialog */}
            <Dialog open={clubDialogOpen} onOpenChange={setClubDialogOpen}>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>{editingClub ? "Club Bewerken" : "Nieuwe Club"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Naam *</Label>
                      <Input
                        value={clubForm.name}
                        onChange={(e) => setClubForm({ ...clubForm, name: e.target.value })}
                        placeholder="Club naam"
                      />
                    </div>
                    <div>
                      <Label>Locatie *</Label>
                      <Input
                        value={clubForm.location}
                        onChange={(e) => setClubForm({ ...clubForm, location: e.target.value })}
                        placeholder="Stad, Provincie"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Beschrijving</Label>
                    <Textarea
                      value={clubForm.description}
                      onChange={(e) => setClubForm({ ...clubForm, description: e.target.value })}
                      placeholder="Korte beschrijving van de club..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Website</Label>
                      <Input
                        value={clubForm.website}
                        onChange={(e) => setClubForm({ ...clubForm, website: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={clubForm.email}
                        onChange={(e) => setClubForm({ ...clubForm, email: e.target.value })}
                        placeholder="info@club.nl"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Telefoon</Label>
                      <Input
                        value={clubForm.phone}
                        onChange={(e) => setClubForm({ ...clubForm, phone: e.target.value })}
                        placeholder="+31..."
                      />
                    </div>
                    <div>
                      <Label>Afbeelding URL</Label>
                      <Input
                        value={clubForm.image_url}
                        onChange={(e) => setClubForm({ ...clubForm, image_url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setClubDialogOpen(false)}>
                    Annuleren
                  </Button>
                  <Button onClick={handleSaveClub}>
                    <Save className="w-4 h-4 mr-2" />
                    Opslaan
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Sponsors Tab */}
          <TabsContent value="sponsors">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Sponsoren</CardTitle>
                  <CardDescription>Beheer adverteerders en partners</CardDescription>
                </div>
                <Button onClick={() => openSponsorDialog()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nieuwe Sponsor
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Naam</TableHead>
                      <TableHead>Pakket</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Volgorde</TableHead>
                      <TableHead>Verloopt</TableHead>
                      <TableHead>Acties</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sponsors.map((sponsor) => (
                      <TableRow key={sponsor.id}>
                        <TableCell className="font-medium">{sponsor.name}</TableCell>
                        <TableCell>
                          <Badge className="capitalize">{sponsor.package_type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={sponsor.active ? "default" : "secondary"}>
                            {sponsor.active ? "Actief" : "Inactief"}
                          </Badge>
                        </TableCell>
                        <TableCell>{sponsor.display_order || 0}</TableCell>
                        <TableCell>
                          {sponsor.expires_at 
                            ? new Date(sponsor.expires_at).toLocaleDateString("nl-NL")
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => openSponsorDialog(sponsor)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteSponsor(sponsor.id)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {sponsors.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          Nog geen sponsoren toegevoegd
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Sponsor Dialog */}
            <Dialog open={sponsorDialogOpen} onOpenChange={setSponsorDialogOpen}>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>{editingSponsor ? "Sponsor Bewerken" : "Nieuwe Sponsor"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Naam *</Label>
                      <Input
                        value={sponsorForm.name}
                        onChange={(e) => setSponsorForm({ ...sponsorForm, name: e.target.value })}
                        placeholder="Sponsor naam"
                      />
                    </div>
                    <div>
                      <Label>Pakket Type *</Label>
                      <Select
                        value={sponsorForm.package_type}
                        onValueChange={(v) => setSponsorForm({ ...sponsorForm, package_type: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bronze">Bronze</SelectItem>
                          <SelectItem value="silver">Silver</SelectItem>
                          <SelectItem value="gold">Gold</SelectItem>
                          <SelectItem value="platinum">Platinum</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Beschrijving</Label>
                    <Textarea
                      value={sponsorForm.description}
                      onChange={(e) => setSponsorForm({ ...sponsorForm, description: e.target.value })}
                      placeholder="Korte beschrijving..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Website URL</Label>
                      <Input
                        value={sponsorForm.website_url}
                        onChange={(e) => setSponsorForm({ ...sponsorForm, website_url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <Label>Logo URL</Label>
                      <Input
                        value={sponsorForm.logo_url}
                        onChange={(e) => setSponsorForm({ ...sponsorForm, logo_url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Contact Email</Label>
                      <Input
                        type="email"
                        value={sponsorForm.contact_email}
                        onChange={(e) => setSponsorForm({ ...sponsorForm, contact_email: e.target.value })}
                        placeholder="contact@sponsor.nl"
                      />
                    </div>
                    <div>
                      <Label>Contact Telefoon</Label>
                      <Input
                        value={sponsorForm.contact_phone}
                        onChange={(e) => setSponsorForm({ ...sponsorForm, contact_phone: e.target.value })}
                        placeholder="+31..."
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Weergave Volgorde</Label>
                      <Input
                        type="number"
                        value={sponsorForm.display_order}
                        onChange={(e) => setSponsorForm({ ...sponsorForm, display_order: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label>Verloopt Op</Label>
                      <Input
                        type="date"
                        value={sponsorForm.expires_at}
                        onChange={(e) => setSponsorForm({ ...sponsorForm, expires_at: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={sponsorForm.active}
                      onCheckedChange={(checked) => setSponsorForm({ ...sponsorForm, active: checked })}
                    />
                    <Label>Actief</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSponsorDialogOpen(false)}>
                    Annuleren
                  </Button>
                  <Button onClick={handleSaveSponsor}>
                    <Save className="w-4 h-4 mr-2" />
                    Opslaan
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Content Beheer</CardTitle>
                  <CardDescription>Beheer website teksten en content</CardDescription>
                </div>
                <Button onClick={() => openContentDialog()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nieuwe Content
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pagina</TableHead>
                      <TableHead>Sectie</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Content (Preview)</TableHead>
                      <TableHead>Acties</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {content.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.page_key}</TableCell>
                        <TableCell>{item.section_key}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.content_type}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {item.content_nl.substring(0, 50)}...
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => openContentDialog(item)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteContent(item.id)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {content.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          Nog geen content toegevoegd
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Content Dialog */}
            <Dialog open={contentDialogOpen} onOpenChange={setContentDialogOpen}>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>{editingContent ? "Content Bewerken" : "Nieuwe Content"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Pagina Key *</Label>
                      <Input
                        value={contentForm.page_key}
                        onChange={(e) => setContentForm({ ...contentForm, page_key: e.target.value })}
                        placeholder="home, about, contact..."
                      />
                    </div>
                    <div>
                      <Label>Sectie Key *</Label>
                      <Input
                        value={contentForm.section_key}
                        onChange={(e) => setContentForm({ ...contentForm, section_key: e.target.value })}
                        placeholder="hero_title, intro_text..."
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Content Type</Label>
                      <Select
                        value={contentForm.content_type}
                        onValueChange={(v) => setContentForm({ ...contentForm, content_type: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Tekst</SelectItem>
                          <SelectItem value="title">Titel</SelectItem>
                          <SelectItem value="subtitle">Subtitel</SelectItem>
                          <SelectItem value="button">Knop Tekst</SelectItem>
                          <SelectItem value="image">Afbeelding URL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Volgorde</Label>
                      <Input
                        type="number"
                        value={contentForm.display_order}
                        onChange={(e) => setContentForm({ ...contentForm, display_order: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Content (Nederlands) *</Label>
                    <Textarea
                      rows={6}
                      value={contentForm.content_nl}
                      onChange={(e) => setContentForm({ ...contentForm, content_nl: e.target.value })}
                      placeholder="Voer de content in..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setContentDialogOpen(false)}>
                    Annuleren
                  </Button>
                  <Button onClick={handleSaveContent}>
                    <Save className="w-4 h-4 mr-2" />
                    Opslaan
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
