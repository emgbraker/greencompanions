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
import { AlertTriangle, Ban, Eye } from "lucide-react";
import { toast } from "sonner";

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [content, setContent] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [warningReason, setWarningReason] = useState("");
  const [warningSeverity, setWarningSeverity] = useState<"warning" | "serious" | "blocked">("warning");

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
      .select("*, user_roles(role)")
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
          <p className="text-muted-foreground">Beheer gebruikers, clubs en content</p>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Gebruikers</TabsTrigger>
            <TabsTrigger value="clubs">Golf Clubs</TabsTrigger>
            <TabsTrigger value="sponsors">Sponsoren</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>

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
                      <TableHead>Handicap</TableHead>
                      <TableHead>Provincie</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Acties</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.first_name} {user.last_name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.handicap || "-"}</TableCell>
                        <TableCell>{user.province || "-"}</TableCell>
                        <TableCell>
                          {user.blocked ? (
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
                                  onClick={() => setSelectedUser(user)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Gebruiker Details</DialogTitle>
                                  <DialogDescription>
                                    {user.first_name} {user.last_name}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label className="text-sm font-medium">Bio</Label>
                                    <p className="text-sm text-muted-foreground">{user.bio || "Geen bio"}</p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">Geslacht</Label>
                                      <p className="text-sm">{user.gender || "-"}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Golfclub</Label>
                                      <p className="text-sm">{user.golf_club || "-"}</p>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>

                            {user.blocked ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUnblockUser(user.id)}
                              >
                                Deblokkeer
                              </Button>
                            ) : (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedUser(user)}
                                  >
                                    <AlertTriangle className="w-4 h-4 mr-1" />
                                    Waarschuw
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Gebruiker Waarschuwen</DialogTitle>
                                    <DialogDescription>
                                      Waarschuw of blokkeer {user.first_name} {user.last_name}
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

          <TabsContent value="clubs">
            <Card>
              <CardHeader>
                <CardTitle>Golf Clubs</CardTitle>
                <CardDescription>
                  Beheer partner golf clubs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button>
                    Nieuwe Club Toevoegen
                  </Button>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Naam</TableHead>
                        <TableHead>Locatie</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Acties</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clubs.map((club) => (
                        <TableRow key={club.id}>
                          <TableCell className="font-medium">{club.name}</TableCell>
                          <TableCell>{club.location}</TableCell>
                          <TableCell>{club.email}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              Bewerken
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sponsors">
            <Card>
              <CardHeader>
                <CardTitle>Sponsoren</CardTitle>
                <CardDescription>
                  Beheer adverteerders en partners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button>Nieuwe Sponsor Toevoegen</Button>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Naam</TableHead>
                        <TableHead>Package</TableHead>
                        <TableHead>Status</TableHead>
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
                          <TableCell>
                            {sponsor.expires_at 
                              ? new Date(sponsor.expires_at).toLocaleDateString("nl-NL")
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">Bewerken</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Content Beheer</CardTitle>
                <CardDescription>
                  Beheer website teksten en content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button>Nieuwe Content Toevoegen</Button>
                  <div className="text-sm text-muted-foreground">
                    <p>Met content beheer kunt u:</p>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      <li>Teksten op alle pagina's aanpassen</li>
                      <li>Afbeeldingen vervangen</li>
                      <li>SEO metadata beheren</li>
                      <li>Koppen en beschrijvingen wijzigen</li>
                    </ul>
                    <p className="mt-4 font-medium">
                      Content editor interface wordt in de volgende fase toegevoegd
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
