using Ont.SmartContract.Framework;
    using Ont.SmartContract.Framework.Services.Ont;
    using Ont.SmartContract.Framework.Services.System;
    using System;
    using System.ComponentModel;
    using System.Numerics;
    using Helper = Ont.SmartContract.Framework.Helper;

    namespace GroupContract
    {
        public class GroupContract : SmartContract
        {
            // 合约管理员
            //public static readonly byte[] admin = "AeS7aUsTmf7egcGQGS88LZAGD8gNFmCJnD".ToScriptHash();
            public static readonly byte[] admin = {97,111,42,74,56,57,111,242,3,234,1,230,192,112,174,66,27,184,206,45};

            // 有叻积分合约
            [Appcall("749a701ae89c0dbdab9b4b660ba84ee478004219")]
            public static extern object YL(string method, object[] parameter);

            //// 星维积分合约
            //[Appcall("c1cda50ec41e9be5e14bd734f675d0b8a28d89c1")]
            //public static extern object XW(string method, object[] parameter);
            //// 老庙积分合约
            //[Appcall("c1cda50ec41e9be5e14bd734f675d0b8a28d89c1")]
            //public static extern object LM(string method, object[] parameter);

            public delegate object NEP5Contract(string method, object[] args);

            public static Object Main(string operation, params object[] args)
            {
                if (operation == "GroupTransfer")
                {
                    if (args.Length != 3) return false;
                    byte[] from = (byte[])args[0];
                    byte[] to = (byte[])args[1];
                    object[] param = (object[])args[2];
                    return GroupTransfer(from, to, param);
                }
                // 设置合约Hash
                if (operation == "SetContractHash")
                {
                    if (args.Length != 2) return false;
                    string contractKey = (string)args[0];
                    byte[] hash = (byte[])args[1];
                    return SetContractHash(contractKey, hash);
                }
                // 获取指定商户的合约hash
                if (operation == "GetContractHash")
                {
                    if (args.Length != 1) return false;
                    string contractKey = (string)args[0];
                    return GetContractHash(contractKey);
                }
                return false;
            }

            public static bool GroupTransfer(byte[] from, byte[] to, object[] param)
            {
                StorageContext context = Storage.CurrentContext;

                if (from.Length != 20 || to.Length != 20) return false;

                for (int i = 0; i < param.Length; i++)
                {
                    Runtime.Notify("GroupTransfer111111");
                    TransferPair transfer = (TransferPair)param[i];
                    Runtime.Notify("GroupTransfer2222222222");
                    byte[] hash = GetContractHash(transfer.Key);
                    Runtime.Notify("GroupTransfer33333333333");
                    if (hash.Length != 20 || transfer.Value < 0) throw new Exception();
                    if (!TransferNEP5(from, to, hash, transfer.Value)) throw new Exception();
                    Runtime.Notify("GroupTransfer444444444");
                }
                Runtime.Notify("GroupTransfer55555555555");
                return true;
            }

            private static bool TransferNEP5(byte[] from, byte[] to, byte[] assetID, BigInteger amount)
            {
                // Transfer token
                Runtime.Notify("GroupTransfer6666666666");
                var args = new object[] { from, to, amount };
                var contract = (NEP5Contract)assetID.ToDelegate();
                //if (!(bool)contract("transfer", args)) throw new Exception("Failed to transfer NEP-5 tokens!");
                if (!(bool)contract("transfer", args)) return false;
                return true;
            }

            public static bool SetContractHash(string key, byte[] hash)
            {
                if (!Runtime.CheckWitness(admin)) return false;
                if (key == "" || key.Length == 0) return false;
                if (hash.Length != 20) return false;

                StorageContext context = Storage.CurrentContext;
                Storage.Put(context, key, hash);
                return true;
            }

            public static byte[] GetContractHash(string key)
            {
                return Storage.Get(Storage.CurrentContext, key);
            }

            struct TransferPair
            {
                public string Key;
                public ulong Value;
            }
        }
    }