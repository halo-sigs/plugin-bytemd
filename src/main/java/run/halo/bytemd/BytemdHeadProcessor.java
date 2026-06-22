package run.halo.bytemd;

import org.springframework.stereotype.Component;
import org.thymeleaf.context.ITemplateContext;
import org.thymeleaf.model.IModel;
import org.thymeleaf.processor.element.IElementModelStructureHandler;
import reactor.core.publisher.Mono;
import run.halo.app.theme.dialect.TemplateHeadProcessor;

@Component
public class BytemdHeadProcessor implements TemplateHeadProcessor {

    @Override
    public Mono<Void> process(ITemplateContext context, IModel model,
                              IElementModelStructureHandler structureHandler) {
        model.add(context.getModelFactory().createText(mermaidStyle()));
        return Mono.empty();
    }

    private String mermaidStyle() {
        return """
            <!-- plugin-bytemd mermaid start -->
            <style>
            .bytemd-mermaid {
              --bytemd-mermaid-background: white;
              --bytemd-mermaid-primary-color: #ECECFF;
              --bytemd-mermaid-primary-text-color: #131300;
              --bytemd-mermaid-primary-border-color: hsl(240, 60%, 86.2745098039%);
              --bytemd-mermaid-secondary-color: #ffffde;
              --bytemd-mermaid-secondary-text-color: #000021;
              --bytemd-mermaid-secondary-border-color: hsl(60, 60%, 83.5294117647%);
              --bytemd-mermaid-tertiary-color: hsl(80, 100%, 96.2745098039%);
              --bytemd-mermaid-tertiary-text-color: rgb(6.3333333334, 0, 19.0000000001);
              --bytemd-mermaid-tertiary-border-color: hsl(80, 60%, 86.2745098039%);
              --bytemd-mermaid-note-bkg-color: #fff5ad;
              --bytemd-mermaid-note-text-color: black;
              --bytemd-mermaid-note-border-color: #aaaa33;
              --bytemd-mermaid-line-color: #333333;
              --bytemd-mermaid-text-color: #333;
              --bytemd-mermaid-main-bkg: #ECECFF;
              --bytemd-mermaid-error-bkg-color: #552222;
              --bytemd-mermaid-error-text-color: #552222;
              --bytemd-mermaid-node-border: #9370DB;
              --bytemd-mermaid-cluster-bkg: #ffffde;
              --bytemd-mermaid-cluster-border: #aaaa33;
              --bytemd-mermaid-default-link-color: #333333;
              --bytemd-mermaid-title-color: #333;
              --bytemd-mermaid-edge-label-background: #e8e8e8;
              --bytemd-mermaid-actor-bkg: #ECECFF;
              --bytemd-mermaid-actor-border: hsl(259.6261682243, 59.7765363128%, 87.9019607843%);
              --bytemd-mermaid-actor-text-color: black;
              --bytemd-mermaid-actor-line-color: grey;
              --bytemd-mermaid-signal-color: #333;
              --bytemd-mermaid-signal-text-color: #333;
              --bytemd-mermaid-label-box-bkg-color: #ECECFF;
              --bytemd-mermaid-label-box-border-color: hsl(259.6261682243, 59.7765363128%, 87.9019607843%);
              --bytemd-mermaid-label-text-color: black;
              --bytemd-mermaid-loop-text-color: black;
              --bytemd-mermaid-activation-border-color: #666;
              --bytemd-mermaid-activation-bkg-color: #f4f4f4;
              --bytemd-mermaid-sequence-number-color: white;
              --bytemd-mermaid-alt-background: #f0f0f0;
              --bytemd-mermaid-class-text: #131300;
              --bytemd-mermaid-c-scale0: hsl(240, 100%, 76.2745098039%);
              --bytemd-mermaid-c-scale1: hsl(60, 100%, 73.5294117647%);
              --bytemd-mermaid-c-scale2: hsl(80, 100%, 76.2745098039%);
              --bytemd-mermaid-c-scale3: hsl(270, 100%, 76.2745098039%);
              --bytemd-mermaid-c-scale4: hsl(300, 100%, 76.2745098039%);
              --bytemd-mermaid-c-scale5: hsl(330, 100%, 76.2745098039%);
              --bytemd-mermaid-c-scale6: hsl(0, 100%, 76.2745098039%);
              --bytemd-mermaid-c-scale7: hsl(30, 100%, 76.2745098039%);
              --bytemd-mermaid-c-scale8: hsl(90, 100%, 76.2745098039%);
              --bytemd-mermaid-c-scale9: hsl(150, 100%, 76.2745098039%);
              --bytemd-mermaid-c-scale10: hsl(180, 100%, 76.2745098039%);
              --bytemd-mermaid-c-scale11: hsl(210, 100%, 76.2745098039%);
              --bytemd-mermaid-c-scale-inv0: hsl(60, 100%, 86.2745098039%);
              --bytemd-mermaid-c-scale-inv1: hsl(240, 100%, 83.5294117647%);
              --bytemd-mermaid-c-scale-inv2: hsl(260, 100%, 86.2745098039%);
              --bytemd-mermaid-c-scale-inv3: hsl(90, 100%, 86.2745098039%);
              --bytemd-mermaid-c-scale-inv4: hsl(120, 100%, 86.2745098039%);
              --bytemd-mermaid-c-scale-inv5: hsl(150, 100%, 86.2745098039%);
              --bytemd-mermaid-c-scale-inv6: hsl(180, 100%, 86.2745098039%);
              --bytemd-mermaid-c-scale-inv7: hsl(210, 100%, 86.2745098039%);
              --bytemd-mermaid-c-scale-inv8: hsl(270, 100%, 86.2745098039%);
              --bytemd-mermaid-c-scale-inv9: hsl(330, 100%, 86.2745098039%);
              --bytemd-mermaid-c-scale-inv10: hsl(0, 100%, 86.2745098039%);
              --bytemd-mermaid-c-scale-inv11: hsl(30, 100%, 86.2745098039%);
              --bytemd-mermaid-c-scale-label0: #ffffff;
              --bytemd-mermaid-c-scale-label1: black;
              --bytemd-mermaid-c-scale-label2: black;
              --bytemd-mermaid-c-scale-label3: #ffffff;
              --bytemd-mermaid-c-scale-label4: black;
              --bytemd-mermaid-c-scale-label5: black;
              --bytemd-mermaid-c-scale-label6: black;
              --bytemd-mermaid-c-scale-label7: black;
              --bytemd-mermaid-c-scale-label8: black;
              --bytemd-mermaid-c-scale-label9: black;
              --bytemd-mermaid-c-scale-label10: black;
              --bytemd-mermaid-c-scale-label11: black;
              margin: 1rem 0;
              overflow-x: auto;
              text-align: center;
            }
            .bytemd-mermaid svg {
              max-width: 100%;
              height: auto;
            }
            @media (prefers-color-scheme: dark) {
              .color-scheme-auto .bytemd-mermaid,
              [data-color-scheme="auto"] .bytemd-mermaid {
                --bytemd-mermaid-background: #333;
                --bytemd-mermaid-primary-color: #1f2020;
                --bytemd-mermaid-primary-text-color: #e0dfdf;
                --bytemd-mermaid-primary-border-color: #cccccc;
                --bytemd-mermaid-secondary-color: hsl(180, 1.5873015873%, 28.3529411765%);
                --bytemd-mermaid-secondary-text-color: rgb(183.8476190475, 181.5523809523, 181.5523809523);
                --bytemd-mermaid-secondary-border-color: hsl(180, 0%, 18.3529411765%);
                --bytemd-mermaid-tertiary-color: hsl(20, 1.5873015873%, 12.3529411765%);
                --bytemd-mermaid-tertiary-text-color: rgb(222.9999999999, 223.6666666666, 223.9999999999);
                --bytemd-mermaid-tertiary-border-color: hsl(20, 0%, 2.3529411765%);
                --bytemd-mermaid-note-bkg-color: hsl(180, 1.5873015873%, 28.3529411765%);
                --bytemd-mermaid-note-text-color: rgb(183.8476190475, 181.5523809523, 181.5523809523);
                --bytemd-mermaid-note-border-color: hsl(180, 0%, 18.3529411765%);
                --bytemd-mermaid-line-color: lightgrey;
                --bytemd-mermaid-text-color: #ccc;
                --bytemd-mermaid-main-bkg: #1f2020;
                --bytemd-mermaid-error-bkg-color: #a44141;
                --bytemd-mermaid-error-text-color: #ddd;
                --bytemd-mermaid-node-border: #81B1DB;
                --bytemd-mermaid-cluster-bkg: hsl(180, 1.5873015873%, 28.3529411765%);
                --bytemd-mermaid-cluster-border: rgba(255, 255, 255, 0.25);
                --bytemd-mermaid-default-link-color: lightgrey;
                --bytemd-mermaid-title-color: #F9FFFE;
                --bytemd-mermaid-edge-label-background: hsl(0, 0%, 34.4117647059%);
                --bytemd-mermaid-actor-bkg: #1f2020;
                --bytemd-mermaid-actor-border: #81B1DB;
                --bytemd-mermaid-actor-text-color: lightgrey;
                --bytemd-mermaid-actor-line-color: lightgrey;
                --bytemd-mermaid-signal-color: lightgrey;
                --bytemd-mermaid-signal-text-color: lightgrey;
                --bytemd-mermaid-label-box-bkg-color: #1f2020;
                --bytemd-mermaid-label-box-border-color: #81B1DB;
                --bytemd-mermaid-label-text-color: lightgrey;
                --bytemd-mermaid-loop-text-color: lightgrey;
                --bytemd-mermaid-activation-border-color: #81B1DB;
                --bytemd-mermaid-activation-bkg-color: hsl(180, 1.5873015873%, 28.3529411765%);
                --bytemd-mermaid-sequence-number-color: black;
                --bytemd-mermaid-alt-background: #555;
                --bytemd-mermaid-class-text: #e0dfdf;
                --bytemd-mermaid-c-scale0: #1f2020;
                --bytemd-mermaid-c-scale1: #0b0000;
                --bytemd-mermaid-c-scale2: #4d1037;
                --bytemd-mermaid-c-scale3: #3f5258;
                --bytemd-mermaid-c-scale4: #4f2f1b;
                --bytemd-mermaid-c-scale5: #6e0a0a;
                --bytemd-mermaid-c-scale6: #3b0048;
                --bytemd-mermaid-c-scale7: #995a01;
                --bytemd-mermaid-c-scale8: #154706;
                --bytemd-mermaid-c-scale9: #161722;
                --bytemd-mermaid-c-scale10: #00296f;
                --bytemd-mermaid-c-scale11: #01629c;
                --bytemd-mermaid-c-scale-inv0: #e0dfdf;
                --bytemd-mermaid-c-scale-inv1: #f4ffff;
                --bytemd-mermaid-c-scale-inv2: #b2efc8;
                --bytemd-mermaid-c-scale-inv3: #c0ada7;
                --bytemd-mermaid-c-scale-inv4: #b0d0e4;
                --bytemd-mermaid-c-scale-inv5: #91f5f5;
                --bytemd-mermaid-c-scale-inv6: #c4ffb7;
                --bytemd-mermaid-c-scale-inv7: #66a5fe;
                --bytemd-mermaid-c-scale-inv8: #eab8f9;
                --bytemd-mermaid-c-scale-inv9: #e9e8dd;
                --bytemd-mermaid-c-scale-inv10: #ffd690;
                --bytemd-mermaid-c-scale-inv11: #fe9d63;
                --bytemd-mermaid-c-scale-label0: lightgrey;
                --bytemd-mermaid-c-scale-label1: lightgrey;
                --bytemd-mermaid-c-scale-label2: lightgrey;
                --bytemd-mermaid-c-scale-label3: lightgrey;
                --bytemd-mermaid-c-scale-label4: lightgrey;
                --bytemd-mermaid-c-scale-label5: lightgrey;
                --bytemd-mermaid-c-scale-label6: lightgrey;
                --bytemd-mermaid-c-scale-label7: lightgrey;
                --bytemd-mermaid-c-scale-label8: lightgrey;
                --bytemd-mermaid-c-scale-label9: lightgrey;
                --bytemd-mermaid-c-scale-label10: lightgrey;
                --bytemd-mermaid-c-scale-label11: lightgrey;
              }
            }
            .color-scheme-dark .bytemd-mermaid,
            .dark .bytemd-mermaid,
            [data-color-scheme="dark"] .bytemd-mermaid {
              --bytemd-mermaid-background: #333;
              --bytemd-mermaid-primary-color: #1f2020;
              --bytemd-mermaid-primary-text-color: #e0dfdf;
              --bytemd-mermaid-primary-border-color: #cccccc;
              --bytemd-mermaid-secondary-color: hsl(180, 1.5873015873%, 28.3529411765%);
              --bytemd-mermaid-secondary-text-color: rgb(183.8476190475, 181.5523809523, 181.5523809523);
              --bytemd-mermaid-secondary-border-color: hsl(180, 0%, 18.3529411765%);
              --bytemd-mermaid-tertiary-color: hsl(20, 1.5873015873%, 12.3529411765%);
              --bytemd-mermaid-tertiary-text-color: rgb(222.9999999999, 223.6666666666, 223.9999999999);
              --bytemd-mermaid-tertiary-border-color: hsl(20, 0%, 2.3529411765%);
              --bytemd-mermaid-note-bkg-color: hsl(180, 1.5873015873%, 28.3529411765%);
              --bytemd-mermaid-note-text-color: rgb(183.8476190475, 181.5523809523, 181.5523809523);
              --bytemd-mermaid-note-border-color: hsl(180, 0%, 18.3529411765%);
              --bytemd-mermaid-line-color: lightgrey;
              --bytemd-mermaid-text-color: #ccc;
              --bytemd-mermaid-main-bkg: #1f2020;
              --bytemd-mermaid-error-bkg-color: #a44141;
              --bytemd-mermaid-error-text-color: #ddd;
              --bytemd-mermaid-node-border: #81B1DB;
              --bytemd-mermaid-cluster-bkg: hsl(180, 1.5873015873%, 28.3529411765%);
              --bytemd-mermaid-cluster-border: rgba(255, 255, 255, 0.25);
              --bytemd-mermaid-default-link-color: lightgrey;
              --bytemd-mermaid-title-color: #F9FFFE;
              --bytemd-mermaid-edge-label-background: hsl(0, 0%, 34.4117647059%);
              --bytemd-mermaid-actor-bkg: #1f2020;
              --bytemd-mermaid-actor-border: #81B1DB;
              --bytemd-mermaid-actor-text-color: lightgrey;
              --bytemd-mermaid-actor-line-color: lightgrey;
              --bytemd-mermaid-signal-color: lightgrey;
              --bytemd-mermaid-signal-text-color: lightgrey;
              --bytemd-mermaid-label-box-bkg-color: #1f2020;
              --bytemd-mermaid-label-box-border-color: #81B1DB;
              --bytemd-mermaid-label-text-color: lightgrey;
              --bytemd-mermaid-loop-text-color: lightgrey;
              --bytemd-mermaid-activation-border-color: #81B1DB;
              --bytemd-mermaid-activation-bkg-color: hsl(180, 1.5873015873%, 28.3529411765%);
              --bytemd-mermaid-sequence-number-color: black;
              --bytemd-mermaid-alt-background: #555;
              --bytemd-mermaid-class-text: #e0dfdf;
              --bytemd-mermaid-c-scale0: #1f2020;
              --bytemd-mermaid-c-scale1: #0b0000;
              --bytemd-mermaid-c-scale2: #4d1037;
              --bytemd-mermaid-c-scale3: #3f5258;
              --bytemd-mermaid-c-scale4: #4f2f1b;
              --bytemd-mermaid-c-scale5: #6e0a0a;
              --bytemd-mermaid-c-scale6: #3b0048;
              --bytemd-mermaid-c-scale7: #995a01;
              --bytemd-mermaid-c-scale8: #154706;
              --bytemd-mermaid-c-scale9: #161722;
              --bytemd-mermaid-c-scale10: #00296f;
              --bytemd-mermaid-c-scale11: #01629c;
              --bytemd-mermaid-c-scale-inv0: #e0dfdf;
              --bytemd-mermaid-c-scale-inv1: #f4ffff;
              --bytemd-mermaid-c-scale-inv2: #b2efc8;
              --bytemd-mermaid-c-scale-inv3: #c0ada7;
              --bytemd-mermaid-c-scale-inv4: #b0d0e4;
              --bytemd-mermaid-c-scale-inv5: #91f5f5;
              --bytemd-mermaid-c-scale-inv6: #c4ffb7;
              --bytemd-mermaid-c-scale-inv7: #66a5fe;
              --bytemd-mermaid-c-scale-inv8: #eab8f9;
              --bytemd-mermaid-c-scale-inv9: #e9e8dd;
              --bytemd-mermaid-c-scale-inv10: #ffd690;
              --bytemd-mermaid-c-scale-inv11: #fe9d63;
              --bytemd-mermaid-c-scale-label0: lightgrey;
              --bytemd-mermaid-c-scale-label1: lightgrey;
              --bytemd-mermaid-c-scale-label2: lightgrey;
              --bytemd-mermaid-c-scale-label3: lightgrey;
              --bytemd-mermaid-c-scale-label4: lightgrey;
              --bytemd-mermaid-c-scale-label5: lightgrey;
              --bytemd-mermaid-c-scale-label6: lightgrey;
              --bytemd-mermaid-c-scale-label7: lightgrey;
              --bytemd-mermaid-c-scale-label8: lightgrey;
              --bytemd-mermaid-c-scale-label9: lightgrey;
              --bytemd-mermaid-c-scale-label10: lightgrey;
              --bytemd-mermaid-c-scale-label11: lightgrey;
            }
            </style>
            <!-- plugin-bytemd mermaid end -->
            """;
    }
}
