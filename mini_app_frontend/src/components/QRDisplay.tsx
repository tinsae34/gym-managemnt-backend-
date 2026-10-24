import { QRCodeSVG } from 'qrcode.react';

interface QRDisplayProps {
    token: string;
    memberName: string;
}

const QRDisplay = ({ token, memberName }: QRDisplayProps) => {
    return (
        <div className="bg-white border-2 border-black p-6">
            <div className="text-center mb-4">
                <h3 className="text-base font-bold text-black">{memberName}</h3>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">Scan at reception</p>
            </div>

            <div className="flex justify-center">
                <QRCodeSVG
                    value={token}
                    size={220}
                    level="H"
                    includeMargin={true}
                    bgColor="#ffffff"
                    fgColor="#000000"
                />
            </div>

            <div className="mt-4 text-center border-t border-gray-200 pt-3">
                <p className="text-xs text-gray-400 font-mono break-all">{token}</p>
            </div>
        </div>
    );
};

export default QRDisplay;

