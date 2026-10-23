import { QRCodeSVG } from 'qrcode.react';

interface QRDisplayProps {
    token: string;
    memberName: string;
}

const QRDisplay = ({ token, memberName }: QRDisplayProps) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-2xl">
            <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-slate-900">{memberName}</h3>
                <p className="text-xs text-slate-500 mt-1">Scan at reception</p>
            </div>

            <div className="flex justify-center">
                <QRCodeSVG
                    value={token}
                    size={240}
                    level="H"
                    includeMargin={true}
                    bgColor="#ffffff"
                    fgColor="#000000"
                />
            </div>

            <div className="mt-4 text-center">
                <p className="text-xs text-slate-400 font-mono break-all">{token}</p>
            </div>
        </div>
    );
};

export default QRDisplay;
