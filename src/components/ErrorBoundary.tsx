import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-[#1A1A1A] border border-rose-500/40 rounded-2xl max-w-xl mx-auto my-8 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-wider">Aconteceu um imprevisto nesta tela</h2>
            <p className="text-xs text-zinc-400 mt-1">
              O sistema protegeu a sua sessão. Clique abaixo para restaurar a navegação.
            </p>
          </div>
          {this.state.error && (
            <div className="bg-[#0A0A0A] p-3 rounded-xl border border-[#2A2A2A] text-left text-[11px] font-mono text-rose-300 max-h-28 overflow-y-auto">
              {this.state.error.toString()}
            </div>
          )}
          <button
            onClick={this.handleReset}
            className="btn-gold px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 mx-auto cursor-pointer shadow-lg"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Restaurar Tela</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
