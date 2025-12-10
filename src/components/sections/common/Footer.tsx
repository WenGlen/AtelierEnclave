export default function Footer() {
    return (
      <footer className="w-full bg-panel-75 mt-8">
        <div className="max-w-screen-lg mx-auto p-4 text-xs text-muted flex justify-between gap-4
                        flex-col
                        md:flex-row ">

          <div className="flex-1 flex-col-between">
            <div className="font-medium text-base text-emphasized">Atelier Enclave ｜ 療癒秘境</div>
            <div> © {new Date().getFullYear()} Atelier Enclave. All rights reserved.</div>
          </div>

          <div className="flex-col-start">
            <p>Email：AtelierEnclave@gmail.com</p>
            <p>LINE：@AtelierEnclave</p>
            <p>Phone：02-2222-2222</p>
            <p>Address：新北市新北區新北路222號</p>
          </div>
        </div>
      </footer>
    )
  }
  