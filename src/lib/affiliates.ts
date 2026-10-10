import config from '../../config/affiliates.json';

export const AFFILIATES = config;

/** The config flag, unless the build sets DRIVE_SCRIPT=off (CI does: the script only works on the real domain). */
export const DRIVE_ENABLED = config.driveScriptEnabled && process.env.DRIVE_SCRIPT !== 'off';

/**
 * Travelpayouts site verification + Drive, exactly as Travelpayouts supplies it.
 * Base.astro puts it in <head> on every page while `driveScriptEnabled` is true.
 * The CSP in public/_headers allows its origins (emrldtp.com, tp.media, travelpayouts.com).
 */
export const DRIVE_SCRIPT = `<script nowprocket data-noptimize="1" data-cfasync="false" data-wpfc-render="false" seraph-accel-crit="1" data-no-defer="1" data-cmp-ab="2">
  (function () {
    var script = document.createElement("script");
    script.async = 1;
    script.setAttribute("data-cmp-ab","2");
    script.src = '${config.travelpayouts.driveScriptSrc}';
    document.head.appendChild(script);
  })();
</script>`;
