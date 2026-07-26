import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, Plus, ShoppingCart, DollarSign, Edit2, Trash2, X, RefreshCw, Sparkles, Filter, Tag } from 'lucide-react';
import { InventoryProduct } from '../../types';

interface EstoqueViewProps {
  products: InventoryProduct[];
  onAddProduct: (newProduct: Omit<InventoryProduct, 'id'>) => void;
  onUpdateProduct: (product: InventoryProduct) => void;
  onDeleteProduct: (productId: string) => void;
  onRestock: (productId: string, quantity: number) => void;
}

export const EstoqueView: React.FC<EstoqueViewProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onRestock,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<InventoryProduct | null>(null);

  // Form state
  const [formName, setFormName] = useState<string>('');
  const [formItemType, setFormItemType] = useState<'venda' | 'insumo'>('venda');
  const [formCategory, setFormCategory] = useState<InventoryProduct['category']>('pomada');
  const [formStock, setFormStock] = useState<string>('10');
  const [formMinStock, setFormMinStock] = useState<string>('5');
  const [formCostPrice, setFormCostPrice] = useState<string>('15.00');
  const [formSellPrice, setFormSellPrice] = useState<string>('35.00');
  const [formUnit, setFormUnit] = useState<string>('unidade');

  const lowStockProducts = products.filter((p) => p.stock <= p.minStock);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormItemType('venda');
    setFormCategory('pomada');
    setFormStock('10');
    setFormMinStock('5');
    setFormCostPrice('15.00');
    setFormSellPrice('35.00');
    setFormUnit('unidade');
    setIsModalOpen(true);
  };

  const openEditModal = (prod: InventoryProduct) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormItemType(prod.itemType || 'venda');
    setFormCategory(prod.category);
    setFormStock(prod.stock.toString());
    setFormMinStock(prod.minStock.toString());
    setFormCostPrice(prod.costPrice.toString());
    setFormSellPrice(prod.sellPrice.toString());
    setFormUnit(prod.unit);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const stock = parseInt(formStock, 10) || 0;
    const minStock = parseInt(formMinStock, 10) || 0;
    const costPrice = parseFloat(formCostPrice) || 0;
    const sellPrice = parseFloat(formSellPrice) || 0;

    if (editingProduct) {
      onUpdateProduct({
        ...editingProduct,
        name: formName.trim(),
        itemType: formItemType,
        category: formCategory,
        stock,
        minStock,
        costPrice,
        sellPrice,
        unit: formUnit.trim() || 'unidade',
      });
    } else {
      onAddProduct({
        name: formName.trim(),
        itemType: formItemType,
        category: formCategory,
        stock,
        minStock,
        costPrice,
        sellPrice,
        unit: formUnit.trim() || 'unidade',
      });
    }

    setIsModalOpen(false);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (filterType === 'all') return true;
    if (filterType === 'venda') return p.itemType === 'venda' || !p.itemType;
    if (filterType === 'insumo') return p.itemType === 'insumo';
    if (filterType === 'low') return p.stock <= p.minStock;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Banner Header */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#D4AF37]">
            <Package className="w-5 h-5 stroke-[2.5]" />
            <span className="text-xs font-extrabold uppercase tracking-widest">Almoxarifado & Balcão</span>
          </div>
          <h1 className="text-xl font-black uppercase text-white mt-1">Gestão de Estoque & Insumos</h1>
          <p className="text-xs text-zinc-400 font-semibold mt-1 max-w-2xl">
            Cadastre produtos para venda casada de balcão e controle o consumo de insumos de bancada (lâminas, papel, golas, bebidas e pomadas).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {lowStockProducts.length > 0 && (
            <div className="bg-rose-500/20 border border-rose-500/40 text-rose-400 px-3 py-2 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-1.5 shadow-lg">
              <AlertTriangle className="w-4 h-4" />
              <span>{lowStockProducts.length} em alerta!</span>
            </div>
          )}

          <button
            onClick={openAddModal}
            className="btn-gold text-xs px-4 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 font-black cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Cadastrar Produto / Insumo</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#1A1A1A] p-4 rounded-2xl border border-[#2A2A2A]">
        
        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Todos os Itens' },
            { id: 'venda', label: 'Venda de Balcão' },
            { id: 'insumo', label: 'Insumos de Bancada' },
            { id: 'low', label: `Estoque Baixo (${lowStockProducts.length})` },
          ].map((flt) => (
            <button
              key={flt.id}
              onClick={() => setFilterType(flt.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap ${
                filterType === flt.id
                  ? 'bg-[#D4AF37] text-black font-black'
                  : 'bg-[#0A0A0A] text-zinc-400 border border-[#2A2A2A] hover:text-white'
              }`}
            >
              {flt.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome..."
            className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* Product List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((prod) => {
          const isLow = prod.stock <= prod.minStock;
          const isVenda = prod.itemType === 'venda' || !prod.itemType;
          const margin = prod.sellPrice > 0 ? ((prod.sellPrice - prod.costPrice) / prod.sellPrice) * 100 : 0;

          return (
            <div
              key={prod.id}
              className={`bg-[#1A1A1A] border rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all hover:border-zinc-600 ${
                isLow ? 'border-rose-500/60 bg-rose-950/10' : 'border-[#2A2A2A]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                      isVenda 
                        ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    }`}>
                      {isVenda ? 'Venda Balcão' : 'Insumo Interno'}
                    </span>

                    <span className="text-[10px] font-extrabold uppercase bg-[#0A0A0A] text-zinc-400 px-2 py-0.5 rounded-md border border-[#2A2A2A]">
                      {prod.category}
                    </span>
                  </div>

                  {isLow && (
                    <span className="text-[10px] font-black uppercase bg-rose-500 text-black px-2 py-0.5 rounded-md flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Repor
                    </span>
                  )}
                </div>

                <h3 className="font-black text-base text-white uppercase">{prod.name}</h3>

                <div className="mt-3 p-3 bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="label-bold text-zinc-400">Estoque Atual:</span>
                    <span className={`font-mono font-black ${isLow ? 'text-rose-400' : 'text-white'}`}>
                      {prod.stock} {prod.unit}(s)
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="label-bold text-zinc-400">Estoque Mínimo:</span>
                    <span className="font-mono font-bold text-zinc-400">{prod.minStock} {prod.unit}(s)</span>
                  </div>

                  <div className="flex items-center justify-between pt-1.5 border-t border-[#2A2A2A]">
                    <span className="label-bold text-zinc-400">Valores (Custo / Venda):</span>
                    <span className="font-mono font-bold text-zinc-300">
                      R$ {prod.costPrice.toFixed(2)} / <strong className="text-[#D4AF37]">{isVenda ? `R$ ${prod.sellPrice.toFixed(2)}` : 'Consumo'}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-4 pt-3 border-t border-[#2A2A2A] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(prod)}
                    className="p-1.5 hover:bg-[#2A2A2A] text-zinc-400 hover:text-white rounded-lg transition-all"
                    title="Editar produto"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteProduct(prod.id)}
                    className="p-1.5 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 rounded-lg transition-all"
                    title="Excluir produto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onRestock(prod.id, 5)}
                    className="bg-[#2A2A2A] hover:bg-[#333] text-zinc-200 text-[11px] font-bold px-2.5 py-1.5 rounded-lg border border-[#3A3A3A] transition-all"
                    title="Adicionar +5 ao estoque"
                  >
                    +5
                  </button>
                  <button
                    onClick={() => onRestock(prod.id, 10)}
                    className="bg-[#D4AF37] hover:bg-[#c29f2f] text-black text-[11px] font-black px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>+10 Repor</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Product / Insumo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 text-white">
            
            <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="font-black text-base uppercase text-white">
                  {editingProduct ? 'Editar Item no Estoque' : 'Cadastrar Item no Estoque'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-[#2A2A2A] rounded-xl text-zinc-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Type Selection */}
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                  Tipo de Cadastro *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormItemType('venda')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-black uppercase border transition-all ${
                      formItemType === 'venda'
                        ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                        : 'bg-[#0A0A0A] text-zinc-400 border-[#2A2A2A]'
                    }`}
                  >
                    Venda de Balcão
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormItemType('insumo')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-black uppercase border transition-all ${
                      formItemType === 'insumo'
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-[#0A0A0A] text-zinc-400 border-[#2A2A2A]'
                    }`}
                  >
                    Insumo de Bancada
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                  Nome do Produto / Insumo *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: Pomada Matte / Lâmina Descartável"
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                    Categoria
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as InventoryProduct['category'])}
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-3 text-xs text-white font-bold focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="pomada">Pomada / Cera</option>
                    <option value="shampoo">Shampoo / Condicionador</option>
                    <option value="barba">Barba / Pós-Barba</option>
                    <option value="descartavel">Descartável / Lâmina</option>
                    <option value="bebida">Bebida / Frigobar</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                    Unidade de Medida
                  </label>
                  <input
                    type="text"
                    required
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    placeholder="Ex: unidade, frasco, caixa, rolo"
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                    Estoque Atual
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-3 text-xs text-white font-mono font-bold focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                    Estoque Mínimo (Alerta)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formMinStock}
                    onChange={(e) => setFormMinStock(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-3 text-xs text-white font-mono font-bold focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                    Preço de Custo (R$)
                  </label>
                  <input
                    type="number"
                    step="0.10"
                    required
                    value={formCostPrice}
                    onChange={(e) => setFormCostPrice(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-3 text-xs text-white font-mono font-bold focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                    {formItemType === 'venda' ? 'Preço de Venda (R$)' : 'Preço de Venda (Opcional)'}
                  </label>
                  <input
                    type="number"
                    step="0.50"
                    value={formSellPrice}
                    onChange={(e) => setFormSellPrice(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-3 text-xs text-[#D4AF37] font-mono font-bold focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-[#2A2A2A]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-[#1A1A1A] hover:bg-[#222] border border-[#2A2A2A] text-zinc-300 py-3 rounded-xl text-xs font-bold uppercase"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-gold text-xs py-3 rounded-xl font-black uppercase cursor-pointer"
                >
                  {editingProduct ? 'Salvar Item' : 'Cadastrar Item'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
