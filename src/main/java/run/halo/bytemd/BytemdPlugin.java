package run.halo.bytemd;

import org.springframework.stereotype.Component;

import run.halo.app.plugin.BasePlugin;
import run.halo.app.plugin.PluginContext;

/**
 * @author ryanwang
 * @since 2.0.0
 */
@Component
public class BytemdPlugin extends BasePlugin {

    public BytemdPlugin(PluginContext context) {
        super(context);
    }
}
