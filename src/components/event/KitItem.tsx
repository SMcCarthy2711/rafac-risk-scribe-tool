
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface KitItemData {
  item: string;
  caption: string;
}

interface KitItemProps {
  items: KitItemData[];
  setItems: (items: KitItemData[]) => void;
  title: string;
  placeholder: string;
}

const KitItem: React.FC<KitItemProps> = ({ items, setItems, title, placeholder }) => {
  const [newItem, setNewItem] = useState("");
  const [newCaption, setNewCaption] = useState("");

  const handleAddItem = () => {
    if (newItem.trim() === "") return;
    
    const kitItem: KitItemData = {
      item: newItem.trim(),
      caption: newCaption.trim()
    };
    
    setItems([...items, kitItem]);
    setNewItem("");
    setNewCaption("");
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-sm">{title}</h4>
      
      <div className="space-y-2">
        <Input
          type="text"
          placeholder={placeholder}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <Textarea
          placeholder="Caption/additional details (optional)"
          value={newCaption}
          onChange={(e) => setNewCaption(e.target.value)}
          className="min-h-[60px] text-xs"
        />
        <Button 
          type="button" 
          onClick={handleAddItem} 
          size="sm"
          className="bg-green-500 hover:bg-green-700 text-white"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Item
        </Button>
      </div>

      <div className="space-y-2">
        {items.map((kitItem, index) => (
          <div key={index} className="p-3 border rounded-lg bg-slate-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Badge variant="outline" className="mb-1">
                  {kitItem.item}
                </Badge>
                {kitItem.caption && (
                  <p className="text-xs text-gray-600 mt-1">{kitItem.caption}</p>
                )}
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => handleRemoveItem(index)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KitItem;
