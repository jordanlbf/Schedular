import type { Customer } from "../types";
import Panel from "@/shared/ui/Panel";
import Field from "@/shared/ui/Field";
import Input from "@/shared/ui/Input";

export default function CustomerForm({ value, onChange }: { value: Customer; onChange: (c: Customer) => void; }) {
  return (
    <Panel title="Customer">
      <div className="form-row">
        <Field label="Name">
          <Input value={value.name} onChange={(e) => onChange({ ...value, name: e.target.value })} placeholder="Full name" />
        </Field>
        <Field label="Phone">
          <Input value={value.phone} onChange={(e) => onChange({ ...value, phone: e.target.value })} placeholder="e.g. 555-1234" />
        </Field>
        <Field label="Email">
          <Input value={value.email} onChange={(e) => onChange({ ...value, email: e.target.value })} placeholder="name@example.com" />
        </Field>
      </div>
    </Panel>
  );
}
