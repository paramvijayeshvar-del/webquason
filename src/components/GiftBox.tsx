export function GiftBox() {
  return (
    <div className="gift-wrap relative mx-auto w-full max-w-[300px]">
      <div className="floaty">
        <div className="rounded-[32px] bg-blush p-3 shadow-box ring-1 ring-cream/60">
          <div className="relative overflow-hidden rounded-[24px] bg-cream p-6 ring-1 ring-ink/5">
            <div className="gift-ribbon absolute inset-y-0 left-1/2 w-3 -translate-x-1/2 bg-blush/60" />
            <div className="gift-ribbon absolute inset-x-0 top-[58px] h-3 bg-blush/60" />
            <div className="relative flex justify-center">
              <div className="grid size-16 place-items-center rounded-full bg-butter text-2xl text-rose ring-4 ring-cream">
                ♥
              </div>
            </div>
            <p className="relative mt-5 text-center font-display text-xl font-semibold">The Box</p>
            <p className="relative text-center font-hand text-lg text-ink-soft">sealed with a ribbon</p>
          </div>
        </div>
      </div>
      <span className="drift absolute -left-3 -top-3 text-2xl text-rose">✦</span>
      <span className="twinkle absolute -bottom-2 -right-2 text-xl text-lav-deep">✦</span>
      <span className="twinkle absolute -right-6 top-10 text-sage-deep" style={{ animationDelay: "1.2s" }}>♥</span>
      <span className="absolute -left-14 bottom-10 hidden -rotate-6 font-hand text-xl text-sage-deep lg:block">pressed petal</span>
      <span className="absolute -right-14 -top-6 hidden rotate-6 font-hand text-xl text-lav-deep lg:block">folded note</span>
    </div>
  );
}
