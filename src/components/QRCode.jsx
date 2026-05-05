import React, { useEffect, useRef } from 'react';
import QRCodeLib from 'qrcode';
import { Play, Smartphone } from 'lucide-react';

const QRCodeSection = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCodeLib.toCanvas(
        canvasRef.current,
        'https://www.braspex.com.br/video-apresentacao',
        {
          width: 200,
          height: 200,
          color: {
            dark: '#005563',
            light: '#FFFFFF'
          },
          margin: 2
        },
        (error) => {
          if (error) {
            console.error('Erro ao gerar QR Code:', error);
          }
        }
      );
    }
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-[#005563] to-[#007A8A]">
      <div className="max-w-4xl mx-auto px-5 text-center">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Conheça Mais Sobre a Braspex
          </h2>
          <div className="w-24 h-1 bg-[#FFD027] mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
            Escaneie o QR Code para assistir a um vídeo com apresentação da empresa, 
            kits sendo produzidos e depoimentos de clientes.
          </p>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          {/* QR Code */}
          <div className="bg-white p-8 rounded-2xl shadow-2xl">
            <canvas 
              ref={canvasRef}
              className="mx-auto"
            />
          </div>

          {/* Instructions */}
          <div className="text-white max-w-md">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#FFD027] rounded-full flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-[#005563]" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold mb-1">Como usar</h3>
                <p className="text-white/80">Abra a câmera do seu celular</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#FFD027] rounded-full flex items-center justify-center">
                <span className="text-[#005563] font-bold text-lg">2</span>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold mb-1">Escaneie</h3>
                <p className="text-white/80">Aponte para o QR Code</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FFD027] rounded-full flex items-center justify-center">
                <Play className="w-6 h-6 text-[#005563]" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold mb-1">Assista</h3>
                <p className="text-white/80">Conheça nossa empresa</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <p className="text-white/90 text-lg">
            <strong>Vídeo institucional</strong> com duração de aproximadamente 5 minutos, 
            mostrando nossos processos, instalações e cases de sucesso.
          </p>
        </div>
      </div>
    </section>
  );
};

export default QRCodeSection;
