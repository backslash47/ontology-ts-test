from ontology.ont_sdk import OntologySdk


def main():
    sdk = init()
    deploy(sdk)
    invoke(sdk)


def init():
    sdk = OntologySdk()
    rpc = "http://127.0.0.1:20336"
    sdk.set_rpc(rpc)
    return sdk


def deploy(sdk: OntologySdk):
    # avm文件路径
    avm_path = "./contract/group/GroupContract.avm"
    # 钱包文件路径
    wallet_path = "./test.json"
    sdk.wallet_manager.open_wallet(wallet_path)
    address = ""
    password = ""
    acct = sdk.wallet_manager.get_account(address, password)
    gaslimit = 2000000
    gasprice = 0
    code = read_code(avm_path)
    tx = sdk.neo_vm().make_deploy_transaction(code, True, "name", "version", "me"
                                              , "", "test contract",acct.get_address_base58(), gaslimit, gasprice)
    sdk.add_sign_transaction(tx, acct)
    sdk.rpc.send_raw_transaction(tx)
    print("deploy")


def invoke(sdk: OntologySdk):
    print("invoke")


def read_code(path: str):
    with open(path, 'r') as f:
        return f.read()


if __name__ == "__main__":
   main()