import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Loader2, RefreshCw, Plus, Edit2, Save, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface Plan {
  id: string;
  name: string;
  min_amount: number;
  max_amount: number;
  roi: number;
  duration: string;
}

const emptyPlan = { name: "", min_amount: 0, max_amount: 0, roi: 0, duration: "" };

const AdminPlans = () => {
  const { toast } = useToast();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newPlan, setNewPlan] = useState(emptyPlan);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPlan, setEditPlan] = useState(emptyPlan);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("investment_plans").select("*").order("min_amount", { ascending: true });
    if (data) setPlans(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPlans(); }, [fetchPlans]);

  const handleAdd = async () => {
    if (!newPlan.name || !newPlan.duration || newPlan.min_amount <= 0) {
      toast({ title: "Fill all fields", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("investment_plans").insert([newPlan]);
    if (error) toast({ title: "Error adding plan", variant: "destructive" });
    else { toast({ title: "Plan added" }); setShowAdd(false); setNewPlan(emptyPlan); await fetchPlans(); }
    setSaving(false);
  };

  const handleUpdate = async (id: string) => {
    setSaving(true);
    const { error } = await supabase.from("investment_plans").update(editPlan).eq("id", id);
    if (error) toast({ title: "Error updating plan", variant: "destructive" });
    else { toast({ title: "Plan updated" }); setEditingId(null); await fetchPlans(); }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("investment_plans").delete().eq("id", deleteId);
    if (error) toast({ title: "Error deleting plan", variant: "destructive" });
    else { toast({ title: "Plan deleted" }); await fetchPlans(); }
    setDeleteId(null);
  };

  const PlanForm = ({ plan, setPlan, onSave, onCancel, saveLabel }: any) => (
    <div className="card-elevated rounded-xl border border-primary/30 bg-primary/5 p-5 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground">Name</label>
          <Input value={plan.name} onChange={(e) => setPlan({ ...plan, name: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Duration</label>
          <Input value={plan.duration} onChange={(e) => setPlan({ ...plan, duration: e.target.value })} placeholder="e.g. 30 days" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Min Amount ($)</label>
          <Input type="number" value={plan.min_amount} onChange={(e) => setPlan({ ...plan, min_amount: Number(e.target.value) })} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Max Amount ($)</label>
          <Input type="number" value={plan.max_amount} onChange={(e) => setPlan({ ...plan, max_amount: Number(e.target.value) })} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">ROI (%)</label>
          <Input type="number" value={plan.roi} onChange={(e) => setPlan({ ...plan, roi: Number(e.target.value) })} />
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={onSave} disabled={saving} className="gap-1">
          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} {saveLabel}
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel}><X className="w-3 h-3" /> Cancel</Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Button size="sm" onClick={() => setShowAdd(true)} className="gap-2" disabled={showAdd}>
          <Plus className="w-4 h-4" /> Add Plan
        </Button>
        <Button variant="outline" size="sm" onClick={fetchPlans} className="gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {showAdd && (
        <PlanForm plan={newPlan} setPlan={setNewPlan} onSave={handleAdd} onCancel={() => { setShowAdd(false); setNewPlan(emptyPlan); }} saveLabel="Create Plan" />
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : plans.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No investment plans found.</div>
      ) : (
        <div className="space-y-3">
          {plans.map((plan, i) => (
            <motion.div key={plan.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              {editingId === plan.id ? (
                <PlanForm plan={editPlan} setPlan={setEditPlan} onSave={() => handleUpdate(plan.id)} onCancel={() => setEditingId(null)} saveLabel="Save" />
              ) : (
                <div className="card-elevated rounded-xl border border-border p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">{plan.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${plan.min_amount.toLocaleString()} – ${plan.max_amount.toLocaleString()} · {plan.duration} · {plan.roi}% ROI
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditingId(plan.id); setEditPlan({ name: plan.name, min_amount: plan.min_amount, max_amount: plan.max_amount, roi: plan.roi, duration: plan.duration }); }}>
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(plan.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Plan</AlertDialogTitle>
            <AlertDialogDescription>Are you sure? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPlans;
